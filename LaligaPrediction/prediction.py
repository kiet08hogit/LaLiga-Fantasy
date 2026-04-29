import pandas as pd
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from contextlib import asynccontextmanager
import sys

model_dir = os.path.dirname(os.path.abspath(__file__))
scaler_path = os.path.join(model_dir, 'scaler.pkl')
model_path = os.path.join(model_dir, 'laliga_rf_model.pkl')

def train_model():
    dataset_path = os.path.join(model_dir, 'master_dataset.csv')
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset {dataset_path} not found. Please ensure it exists.")
        return
    
    print("Loading dataset...")
    df = pd.read_csv(dataset_path)
    
    # Label (binary): 1 for Home Win, 0 for Draw/Away Win
    df["result"] = df["FTR"].map({"H": 1, "D": 0, "A": 0})
    
    # Features
    features = [
        "HS", "AS", "HST", "AST", "HF", "AF", "HC", "AC", "HY", "AY"
    ]
    X = df[features]
    y = df["result"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Normalize features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print("Training Random Forest Classifier...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train_scaled, y_train)
    
    accuracy = rf_model.score(X_test_scaled, y_test)
    print(f"Random Forest Model trained! Test Accuracy: {accuracy:.4f}")
    
    joblib.dump(scaler, scaler_path)
    joblib.dump(rf_model, model_path)
    print("Model and scaler saved.")

# Define request body for prediction
class MatchStats(BaseModel):
    HS: float
    AS: float
    HST: float
    AST: float
    HF: float
    AF: float
    HC: float
    AC: float
    HY: float
    AY: float

# Load model and scaler on startup
ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Train if not exists
    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        print("Model files not found. Initiating training...")
        train_model()
    
    if os.path.exists(model_path) and os.path.exists(scaler_path):
        ml_models["scaler"] = joblib.load(scaler_path)
        ml_models["model"] = joblib.load(model_path)
        print("Model and scaler loaded successfully. Ready for predictions!")
    else:
        print("Warning: Could not load model/scaler.")
    yield
    ml_models.clear()

app = FastAPI(lifespan=lifespan, title="La Liga Prediction API")

# Setup CORS for frontend to access this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow your frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
def predict_match(stats: MatchStats):
    if "model" not in ml_models or "scaler" not in ml_models:
        raise HTTPException(status_code=500, detail="Model not loaded. Try restarting the server.")
    
    # Convert input to dataframe to match training format
    input_data = pd.DataFrame([stats.dict()])
    
    # Scale features
    scaled_data = ml_models["scaler"].transform(input_data)
    
    # Predict
    prediction = ml_models["model"].predict(scaled_data)
    probability = ml_models["model"].predict_proba(scaled_data)
    
    # probability[0][1] is probability of Home Win (class 1)
    # probability[0][0] is probability of Draw/Away Win (class 0)
    home_win_prob = probability[0][1]
    
    return {
        "home_win_prediction": int(prediction[0]),
        "home_win_probability": float(home_win_prob)
    }

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--train":
        train_model()
    else:
        print("Starting FastAPI server on port 8000...")
        uvicorn.run("prediction:app", host="0.0.0.0", port=8000, reload=True)