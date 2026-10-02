import os
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.models.transaction import Transaction

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
    velocity = await calculate_velocity(user_id, db)
    
    # Lightweight AI simulation for Vercel Serverless (Bypass XGBoost 250MB limit)
    risk_score = 0
    if amount > 5000:
        risk_score += 0.6
    elif amount > 1000:
        risk_score += 0.3
        
    if velocity >= 3:
        risk_score += 0.5
    elif velocity >= 2:
        risk_score += 0.2
        
    if location.lower() == 'international':
        risk_score += 0.4
        
    if tx_type.lower() == 'withdrawal':
        risk_score += 0.2
        
    return risk_score >= 0.8
