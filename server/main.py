from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json
import hashlib
import datetime
import logging
import os
from dotenv import load_dotenv

# Import Agents
from intake_extraction_agent import IntakeExtractionAgent
from data_quality_agent import DataQualityAgent
from scaling_bridge import ScalingBridge

load_dotenv()

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MediGuard-Server")

app = FastAPI(title="MediGuard API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Agents
intake_agent = IntakeExtractionAgent()
quality_agent = DataQualityAgent()
scaling_bridge = ScalingBridge()

# Blockchain Simulation
BLOCKCHAIN_FILE = "blockchain.json"

def load_blockchain():
    try:
        with open(BLOCKCHAIN_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def append_to_blockchain(data: dict):
    chain = load_blockchain()
    prev_hash = chain[-1]["hash"] if chain else "0" * 64
    
    block = {
        "index": len(chain) + 1,
        "timestamp": datetime.datetime.now().isoformat(),
        "data": data,
        "prev_hash": prev_hash,
        "hash": hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()
    }
    
    chain.append(block)
    with open(BLOCKCHAIN_FILE, "w") as f:
        json.dump(chain, f, indent=2)
    
    return block

# Models
class AnalysisRequest(BaseModel):
    text: str
    file_name: Optional[str] = None
    mode: Optional[str] = "text" # 'text' or 'pdf'

# Endpoints
@app.get("/")
def read_root():
    return {"status": "MediGuard System Operational", "agents": ["Intake", "Quality", "Scaling"]}

@app.post("/api/analyze")
def analyze_symptoms(request: AnalysisRequest):
    logger.info(f"Received analysis request. Mode: {request.mode}")
    
    try:
        # --- Step 1: Intake & Extraction (Agent 1) ---
        if request.mode == "pdf" and request.file_name:
            # In a real app, we'd handle file upload. Here we assume text is passed or path is known.
            # For this demo, we'll treat 'text' as the raw content extracted on client or passed directly.
            extraction_result = intake_agent.extract_from_text(request.text)
        else:
            extraction_result = intake_agent.extract_from_text(request.text)
            
        unified_data = intake_agent.unify_features(extraction_result)
        raw_features = unified_data["features"]
        
        # --- Step 2: Data Quality & Validation (Agent 2) ---
        validation_result = quality_agent.validate(raw_features)
        clean_features = validation_result["clean_features"]
        quality_report = validation_result["data_quality_report"]
        
        # --- Step 3: Scaling Bridge (Agent 3) ---
        scaling_result = scaling_bridge.scale_features(clean_features)
        scaled_features = scaling_result["scaled_features"]
        
        # --- Step 4: Mock ML Prediction (Placeholder for real model) ---
        # Calculate a simple health score based on scaled features
        # Higher score = Better health (inverse of risk)
        # This is just a heuristic for demo purposes
        risk_factors = 0
        if scaled_features.get("bmi", 0) > 0.5: risk_factors += 1
        if scaled_features.get("glucose", 0) > 0.5: risk_factors += 1
        if scaled_features.get("blood_pressure_systolic", 0) > 0.5: risk_factors += 1
        
        health_score = max(10, 100 - (risk_factors * 15))
        
        triage_category = "Green"
        if health_score < 60: triage_category = "Red"
        elif health_score < 80: triage_category = "Yellow"

        result = {
            "analysis": {
                "health_score": health_score,
                "triage_category": triage_category,
                "features": clean_features,
                "scaled_features": scaled_features,
                "quality_report": quality_report,
                "warnings": unified_data["warnings"] + quality_report["warnings"]
            }
        }

        # --- Step 5: Blockchain Log ---
        log_entry = {
            "type": "ANALYSIS_RESULT",
            "timestamp": datetime.datetime.now().isoformat(),
            "health_score": health_score,
            "triage": triage_category,
            "features_hash": hashlib.md5(json.dumps(clean_features, sort_keys=True).encode()).hexdigest()
        }
        block = append_to_blockchain(log_entry)
        result["blockchain_log"] = block
        
        return result

    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/blockchain")
def get_blockchain():
    return load_blockchain()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
