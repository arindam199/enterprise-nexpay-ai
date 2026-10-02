import pickle
import os
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'fraud_model.pkl')
model = None

def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
            
def predict_fraud(amount: float, tx_type: str, location: str) -> bool:
    if model is None:
        load_model()
        
    if model is None:
        return amount > 10000 
        
    type_map = {'transfer': 0, 'payment': 1, 'withdrawal': 2}
    loc_map = {'local': 0, 'international': 1}
    
    t_val = type_map.get(tx_type.lower(), 1)
    l_val = loc_map.get(location.lower(), 0)
    
    features = pd.DataFrame([{
        'amount': amount,
        'tx_type': t_val,
        'location': l_val
    }])
    
    prediction = model.predict(features)[0]
    return bool(prediction)
