"""Predictive Health Agent (Agent 4)

This agent uses Google Gemini to analyze current clinical features and generate
predictive insights, focusing on:
1. Persistence Risks: Consequences of maintaining current habits.
2. Improvement Gains: Benefits of positive lifestyle changes.
3. Novel Insights: Unique patterns or correlations not immediately obvious.
"""
import os
import json
import logging
from typing import Dict, Any, List
import google.generativeai as genai
from dotenv import load_dotenv
import shap
import pandas as pd
import numpy as np

load_dotenv()

logger = logging.getLogger(__name__)

class PredictiveAgent:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None
            logger.warning("No GEMINI_API_KEY found. Predictive capabilities disabled.")

    def generate_predictions(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Generate predictive insights based on clinical features."""
        if not self.model:
            return self._get_mock_predictions()

        # Filter out None values for cleaner prompt
        active_features = {k: v for k, v in features.items() if v is not None}
        
        prompt = (
            "Act as an advanced medical AI. Analyze the following patient vitals and generate a predictive report. "
            "Return ONLY a JSON object with the following structure:\n"
            "{\n"
            "  'persistence_risks': [{'condition': 'string', 'probability': 'int (0-100)', 'impact': 'string', 'timeframe': 'string'}],\n"
            "  'improvement_gains': [{'habit': 'string', 'benefit': 'string', 'health_score_increase': 'int (0-100)', 'timeframe': 'string'}],\n"
            "  'novel_insights': [{'title': 'string', 'description': 'string', 'type': 'warning|success|neutral'}]\n"
            "}\n\n"
            f"Patient Data: {json.dumps(active_features)}\n"
            "Focus on realistic medical consequences. Be specific."
        )

        try:
            response = self.model.generate_content(prompt)
            text_resp = response.text
            
            # Clean markdown code blocks
            if "```json" in text_resp:
                text_resp = text_resp.split("```json")[1].split("```")[0]
            elif "```" in text_resp:
                text_resp = text_resp.split("```")[1].split("```")[0]
                
            return json.loads(text_resp)

        except Exception as e:
            logger.error(f"Predictive analysis failed: {e}")
            return self._get_mock_predictions()

    def explain_prediction(self, model, input_df: pd.DataFrame, predicted_class_idx: int) -> Dict[str, Any]:
        """
        Generate SHAP explanations for the model's prediction.
        
        Args:
            model: The trained CatBoost model.
            input_df: DataFrame containing the single instance to explain.
            predicted_class_idx: The index of the predicted class.
            
        Returns:
            Dict containing top contributing features.
        """
        try:
            # Create explainer (TreeExplainer is optimized for CatBoost)
            explainer = shap.TreeExplainer(model)
            
            # Calculate SHAP values
            shap_values = explainer.shap_values(input_df)
            
            logger.info(f"SHAP values type: {type(shap_values)}")
            logger.info(f"SHAP values shape: {shap_values.shape if hasattr(shap_values, 'shape') else 'N/A'}")
            
            # For multiclass, shap_values is a list of arrays (one for each class)
            # We want the values for the predicted class
            if isinstance(shap_values, list):
                class_shap_values = shap_values[predicted_class_idx]
                logger.info(f"Using class {predicted_class_idx}, shape: {class_shap_values.shape}")
            else:
                class_shap_values = shap_values # Binary case
                logger.info(f"Binary classification, shape: {class_shap_values.shape}")
                
            # Get the values for the single instance (row 0)
            instance_values = class_shap_values[0]
            feature_names = input_df.columns.tolist()
            
            logger.info(f"Instance values type: {type(instance_values)}, length: {len(instance_values)}")
            
            # Create a list of (feature, value) tuples
            feature_importance = []
            for i in range(len(feature_names)):
                try:
                    # Convert to Python native types using multiple methods
                    val = instance_values[i]
                    
                    # Try different conversion methods
                    if hasattr(val, 'item'):
                        impact = float(val.item())
                    elif isinstance(val, (int, float)):
                        impact = float(val)
                    else:
                        impact = float(np.asarray(val).item())
                    
                    feature_value = float(input_df.iloc[0, i])
                    
                    feature_importance.append({
                        "feature": feature_names[i],
                        "impact": impact,
                        "value": feature_value
                    })
                except Exception as e:
                    logger.error(f"Failed to process feature {feature_names[i]} at index {i}: {e}, value type: {type(instance_values[i])}")
                    continue
            
            logger.info(f"Successfully processed {len(feature_importance)} features")
            
            # Sort by absolute impact to find most important features
            feature_importance.sort(key=lambda x: abs(x["impact"]), reverse=True)
            
            # Top 5 most impactful features
            top_features = feature_importance[:5]
            
            # Extract base value safely
            try:
                if hasattr(explainer.expected_value, '__getitem__'):
                    base_val = explainer.expected_value[predicted_class_idx]
                else:
                    base_val = explainer.expected_value
                    
                if hasattr(base_val, 'item'):
                    base_value = float(base_val.item())
                elif isinstance(base_val, (int, float)):
                    base_value = float(base_val)
                else:
                    base_value = float(np.asarray(base_val).item())
            except Exception as e:
                logger.error(f"Failed to extract base value: {e}")
                base_value = 0.0
            
            logger.info(f"Returning {len(top_features)} top features")
            
            return {
                "top_features": top_features,
                "base_value": base_value
            }
            
        except Exception as e:
            logger.error(f"SHAP explanation failed: {e}", exc_info=True)
            return {"error": str(e), "top_features": [], "base_value": 0.0}

    def _get_mock_predictions(self) -> Dict[str, Any]:
        """Fallback mock data if API fails."""
        return {
            "persistence_risks": [
                {"condition": "Hypertension", "probability": 45, "impact": "Increased strain on heart", "timeframe": "5 years"},
                {"condition": "Metabolic Syndrome", "probability": 30, "impact": "Insulin resistance", "timeframe": "3 years"}
            ],
            "improvement_gains": [
                {"habit": "Reduce Sodium Intake", "benefit": "Lower Blood Pressure", "health_score_increase": 15, "timeframe": "3 months"},
                {"habit": "30min Daily Cardio", "benefit": "Improved Heart Health", "health_score_increase": 20, "timeframe": "6 months"}
            ],
            "novel_insights": [
                {"title": "Circadian Rhythm", "description": "Your vitals suggest irregular sleep patterns affecting recovery.", "type": "warning"}
            ]
        }
