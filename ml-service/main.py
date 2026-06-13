from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import os
import uvicorn

app = FastAPI()

# ==========================
# ENABLE CORS
# ==========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# LOAD MODEL
# ==========================

MODEL_PATH = "anomaly_model.pkl"

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"❌ Model file '{MODEL_PATH}' not found.\n"
        f"Place your trained model inside ml-service folder."
    )

model = joblib.load(MODEL_PATH)

print("✅ Model loaded successfully")


# ==========================
# HOME ROUTE
# ==========================

@app.get("/")
def home():
    return {
        "message": "PulseAI ML Service Running ✅"
    }


# ==========================
# PREDICT ROUTE
# ==========================

@app.get("/predict")
def predict(cpu: float, memory: float):

    try:
        # Create dataframe
        data = pd.DataFrame([{
            "cpu": cpu,
            "memory": memory
        }])

        # Prediction
        prediction = model.predict(data)[0]

        # Anomaly score
        anomaly_score = abs(
            model.decision_function(data)[0]
        )

        # ==========================
        # SMART CONFIDENCE %
        # ==========================

        if prediction == 1:
            confidence = round(
                min(
                    99,
                    80 + (anomaly_score * 20)
                ),
                2
            )

            return {
                "status": "healthy",
                "confidence": confidence,
                "reason": "No anomaly pattern detected"
            }

        else:
            confidence = round(
                max(
                    40,
                    75 - (anomaly_score * 35)
                ),
                2
            )

            return {
                "status": "warning",
                "confidence": confidence,
                "reason": "Unusual system behavior detected"
            }

    except Exception as e:
        return {
            "status": "error",
            "confidence": 0,
            "reason": str(e)
        }


# ==========================
# RUN SERVER
# ==========================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )