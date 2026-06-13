import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

# Load dataset
df = pd.read_csv(
    "dataset/metrics.csv"
)

# Use only features
X = df[
    ["cpu", "memory"]
]

# Train model
model = IsolationForest(
    n_estimators=100,
    contamination=0.01,
    random_state=42
)

model.fit(X)

# Save model
joblib.dump(
    model,
    "anomaly_model.pkl"
)

print(
    "AI model trained successfully ✅"
)