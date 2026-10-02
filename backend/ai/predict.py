import pickle
import os
import pandas as pd
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.models.transaction import Transaction

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'xgboost_fraud.pkl')
model = None

def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)

async def calculate_velocity(user_id: int, db: AsyncSession):
    import datetime
    one_hour_ago = datetime.datetime.utcnow() - datetime.timedelta(hours=1)
    
    result = await db.execute(
        select(func.count(Transaction.id)).where(
            Transaction.user_id == user_id,
            Transaction.timestamp >= one_hour_ago
        )
    )
    return result.scalar() or 0

async def predict_fraud(user_id: int, amount: float, tx_type: str, location: str, db: AsyncSession) -> bool:
    if model is None:
        load_model()
        
    type_map = {'transfer': 0, 'payment': 1, 'withdrawal': 2}
    loc_map = {'local': 0, 'international': 1}
    
    t_val = type_map.get(tx_type.lower(), 1)
    l_val = loc_map.get(location.lower(), 0)
    
    velocity = await calculate_velocity(user_id, db)
    
    features = pd.DataFrame([{
        'amount': amount,
        'tx_type': t_val,
        'location': l_val,
        'user_velocity': velocity
    }])
    
    if model:
        prediction = model.predict(features)[0]
        return bool(prediction)
    return amount > 10000
