import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle
import os

def generate_synthetic_data(n_samples=5000):
    np.random.seed(42)
    
    tx_types = np.random.choice([0, 1, 2], size=n_samples)
    locations = np.random.choice([0, 1], size=n_samples, p=[0.9, 0.1])
    amounts = np.random.lognormal(mean=3, sigma=1.5, size=n_samples)
    
    is_fraud = np.zeros(n_samples)
    
    for i in range(n_samples):
        prob = 0.01
        if amounts[i] > 500: prob += 0.05
        if amounts[i] > 5000: prob += 0.3
        if locations[i] == 1: prob += 0.15
        if tx_types[i] == 2 and amounts[i] > 1000: prob += 0.2
        
        is_fraud[i] = np.random.choice([0, 1], p=[1-prob, prob]) if prob < 1 else 1

    df = pd.DataFrame({
        'amount': amounts,
        'tx_type': tx_types,
        'location': locations,
        'is_fraud': is_fraud
    })
    
    return df

def train_and_save():
    print("Generating synthetic data...")
    df = generate_synthetic_data()
    
    X = df[['amount', 'tx_type', 'location']]
    y = df['is_fraud']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest model...")
    model = RandomForestClassifier(n_estimators=50, random_state=42)
    model.fit(X_train, y_train)
    
    accuracy = model.score(X_test, y_test)
    print(f"Model accuracy on test set: {accuracy:.2f}")
    
    model_path = os.path.join(os.path.dirname(__file__), 'fraud_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_and_save()
