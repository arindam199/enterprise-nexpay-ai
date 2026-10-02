import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import os
import pickle

def generate_enterprise_data(n_samples=20000):
    np.random.seed(42)
    
    # User behaviors
    user_velocities = np.random.randint(0, 10, size=n_samples) # Tx in last hour
    
    tx_types = np.random.choice([0, 1, 2], size=n_samples)
    locations = np.random.choice([0, 1], size=n_samples, p=[0.9, 0.1])
    amounts = np.random.lognormal(mean=3, sigma=1.5, size=n_samples)
    
    is_fraud = np.zeros(n_samples)
    
    for i in range(n_samples):
        prob = 0.005
        if amounts[i] > 1000: prob += 0.05
        if amounts[i] > 10000: prob += 0.4
        if locations[i] == 1: prob += 0.1
        if user_velocities[i] > 5: prob += 0.2
        if tx_types[i] == 2 and amounts[i] > 2000: prob += 0.15
        
        is_fraud[i] = np.random.choice([0, 1], p=[1-prob, prob]) if prob < 1 else 1

    df = pd.DataFrame({
        'amount': amounts,
        'tx_type': tx_types,
        'location': locations,
        'user_velocity': user_velocities,
        'is_fraud': is_fraud
    })
    
    return df

def train_xgboost():
    print("Generating enterprise synthetic data...")
    df = generate_enterprise_data()
    
    X = df[['amount', 'tx_type', 'location', 'user_velocity']]
    y = df['is_fraud']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training XGBoost Classifier...")
    model = xgb.XGBClassifier(
        n_estimators=100, 
        max_depth=5, 
        learning_rate=0.1, 
        random_state=42,
        use_label_encoder=False,
        eval_metric='logloss'
    )
    model.fit(X_train, y_train)
    
    preds = model.predict(X_test)
    accuracy = accuracy_score(y_test, preds)
    print(f"XGBoost Accuracy: {accuracy:.4f}")
    print("Classification Report:")
    print(classification_report(y_test, preds))
    
    model_path = os.path.join(os.path.dirname(__file__), 'xgboost_fraud.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_xgboost()
