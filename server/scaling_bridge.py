"""Scaling Bridge (Agent 3)

Converts clean clinical features into scaled (0-1) values for ML model consumption.
Uses MinMax scaling based on physiological ranges.
"""
from __future__ import annotations

import json
from typing import Dict, Any, Optional

# Re-use ranges from DataQualityAgent for consistency
# In a real app, these might be shared in a config file
PHYSIO_RANGES = {
    "age": (0, 120), "bmi": (8, 80), "glucose": (70, 140),
    "blood_pressure_systolic": (50, 300), "blood_pressure_diastolic": (30, 200),
    "cholesterol_total": (50, 1000), "ldl_cholesterol": (10, 1000),
    "hdl_cholesterol": (5, 200), "triglycerides": (5, 2000),
    "hemoglobin": (3, 25), "platelets": (1e3, 5e6),
    "white_blood_cells": (0.1, 200), "red_blood_cells": (0.5, 10),
    "hematocrit": (5, 80), "mean_corpuscular_volume": (40, 150),
    "mean_corpuscular_hemoglobin": (5, 50),
    "mean_corpuscular_hemoglobin_concentration": (10, 50),
    "hba1c": (3.0, 25.0), "troponin": (0.0, 100.0),
    "alt": (1, 2000), "ast": (1, 2000),
    "creatinine": (0.01, 50), "c_reactive_protein": (0.0, 500.0),
}

class ScalingBridge:
    """Scales features to [0, 1] range."""

    def scale_features(self, clean_features: Dict[str, Any]) -> Dict[str, Any]:
        scaled_features = {}
        
        for key, value in clean_features.items():
            if key == "sex":
                # Encode sex: male=1, female=0, else 0.5
                if value == "male": scaled_features[key] = 1.0
                elif value == "female": scaled_features[key] = 0.0
                else: scaled_features[key] = 0.5
                continue
            
            if value is None or not isinstance(value, (int, float)):
                scaled_features[key] = 0.0 # Default for missing
                continue

            # MinMax Scale
            rng = PHYSIO_RANGES.get(key)
            if rng:
                min_val, max_val = rng
                # Clip to range
                val = max(min_val, min(value, max_val))
                # Scale
                scaled = (val - min_val) / (max_val - min_val)
                scaled_features[key] = round(scaled, 4)
            else:
                scaled_features[key] = value # Pass through if no range

        return {"scaled_features": scaled_features}

if __name__ == "__main__":
    bridge = ScalingBridge()
    sample = {"age": 54, "bmi": 22.5, "glucose": 160, "sex": "male"}
    print(json.dumps(bridge.scale_features(sample), indent=2))
