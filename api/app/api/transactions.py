from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
import datetime
from jose import jwt

from app.api.auth import oauth2_scheme
from app.core.security import SECRET_KEY, ALGORITHM, get_password_hash
from app.core.database import users_db, transactions_db, tx_id_counter, user_id_counter

router = APIRouter()

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    user = users_db.get(email)
    if not user:
        global user_id_counter
        users_db[email] = {
            "id": user_id_counter,
            "name": "Demo User",
            "email": email,
            "hashed_password": get_password_hash("demo"),
            "account_balance": 15000.0
        }
        user = users_db[email]
        user_id_counter += 1
    return user

class TransactionCreate(BaseModel):
    receiver_account: str
    amount: float
    transaction_type: str
    location: str

class TransactionResponse(BaseModel):
    id: int
    receiver_account: str
    amount: float
    transaction_type: str
    location: str
    is_fraud: bool
    timestamp: datetime.datetime

@router.post("/", response_model=TransactionResponse)
async def create_transaction(tx: TransactionCreate, current_user: dict = Depends(get_current_user)):
    global tx_id_counter
    
    # Lightweight AI Simulation
    user_velocity = sum(1 for t in transactions_db if t["user_id"] == current_user["id"])
    risk_score = 0
    if tx.amount > 5000: risk_score += 0.6
    elif tx.amount > 1000: risk_score += 0.3
    if user_velocity >= 3: risk_score += 0.5
    elif user_velocity >= 2: risk_score += 0.2
    if tx.location.lower() == 'international': risk_score += 0.4
    if tx.transaction_type.lower() == 'withdrawal': risk_score += 0.2
    
    is_fraud = risk_score >= 0.8
    
    new_tx = {
        "id": tx_id_counter,
        "user_id": current_user["id"],
        "receiver_account": tx.receiver_account,
        "amount": tx.amount,
        "transaction_type": tx.transaction_type,
        "location": tx.location,
        "is_fraud": is_fraud,
        "timestamp": datetime.datetime.utcnow()
    }
    transactions_db.append(new_tx)
    tx_id_counter += 1
    
    if not is_fraud:
        users_db[current_user["email"]]["account_balance"] -= tx.amount
        
    return new_tx

@router.get("/", response_model=List[TransactionResponse])
async def get_my_transactions(current_user: dict = Depends(get_current_user)):
    user_txs = [t for t in transactions_db if t["user_id"] == current_user["id"]]
    return sorted(user_txs, key=lambda x: x["timestamp"], reverse=True)
