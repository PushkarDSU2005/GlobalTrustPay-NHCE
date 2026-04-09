from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="GlobalTrustPay ML Fraud Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class FraudPredictionRequest(BaseModel):
    amount: float
    country: str
    frequency: int
    user_trust_score: float

class FraudPredictionResponse(BaseModel):
    risk_level: str
    risk_score: float
    analysis: str

# Pure Python heuristic (No numpy/scikit-learn required)
def analyze_fraud_heuristics(req: FraudPredictionRequest) -> dict:
    risk = 0.0
    analysis = []

    # High amount risk
    if req.amount > 10000:
        risk += 0.4
        analysis.append("High transaction volume")
    elif req.amount > 3000:
        risk += 0.2
        analysis.append("Moderate transaction volume")
        
    # Geographic risk (Mock specific regions)
    high_risk_countries = ["RU", "KP"]
    med_risk_countries = ["NG", "BR", "CO"]
    
    if req.country in high_risk_countries:
        risk += 0.5
        analysis.append("Transaction involves a high-risk jurisdiction")
    elif req.country in med_risk_countries:
        risk += 0.2
        analysis.append("Transaction involves a monitored jurisdiction")

    # High frequency in short time
    if req.frequency > 5:
        risk += 0.3
        analysis.append("High frequency of transactions detected")

    # Poor user trust score (< 50)
    if req.user_trust_score < 30:
        risk += 0.4
        analysis.append("Sender possesses a critically low Trust Score")
    elif req.user_trust_score < 60:
        risk += 0.2
        analysis.append("Sender possesses a below-average Trust Score")
    elif req.user_trust_score > 85:
        risk -= 0.3 # Good score dampens risk
        analysis.append("Sender's impeccable Trust Score significantly reduces risk")

    # Normalize risk between 0 and 1
    risk = min(max(risk, 0.0), 1.0)

    # Classify
    if risk < 0.3:
        level = "Low"
    elif risk < 0.7:
        level = "Medium"
    else:
        level = "High"

    if not analysis:
        analysis.append("Transaction appears standard.")

    return {
        "risk_level": level,
        "risk_score": round(risk, 2),
        "analysis": " | ".join(analysis)
    }

@app.post("/fraud/predict", response_model=FraudPredictionResponse)
def predict_fraud(req: FraudPredictionRequest):
    try:
        result = analyze_fraud_heuristics(req)
        return FraudPredictionResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def ping():
    return {"status": "ML Microservice is Online"}
