from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
import datetime
import jwt

from api.app.api.auth import oauth2_scheme
from api.app.core.security import SECRET_KEY, ALGORITHM, get_password_hash
from api.app.core.database import get_db
from api.app.models.user import User
from api.app.models.transaction import Transaction

router = APIRouter()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_exp": False})
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(name="Demo User", email=email, hashed_password=get_password_hash("demo"))
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    except Exception as e:
        return User(id=999, name="Error", email=f"ERR: {str(e)}", hashed_password="x")

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

    class Config:
        from_attributes = True

@router.post("/", response_model=TransactionResponse)
def create_transaction(tx: TransactionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Lightweight AI Simulation
    user_velocity = db.query(Transaction).filter(Transaction.user_id == current_user.id).count()
    risk_score = 0
    if tx.amount > 5000: risk_score += 0.6
    elif tx.amount > 1000: risk_score += 0.3
    if user_velocity >= 3: risk_score += 0.5
    elif user_velocity >= 2: risk_score += 0.2
    if tx.location.lower() == 'international': risk_score += 0.4
    if tx.transaction_type.lower() == 'withdrawal': risk_score += 0.2
    
    is_fraud = risk_score >= 0.8
    
    new_tx = Transaction(
        user_id=current_user.id,
        receiver_account=tx.receiver_account,
        amount=tx.amount,
        transaction_type=tx.transaction_type,
        location=tx.location,
        is_fraud=is_fraud
    )
    db.add(new_tx)
    if not is_fraud:
        current_user.account_balance -= tx.amount
        
    db.commit()
    db.refresh(new_tx)
    return new_tx

@router.get("/", response_model=List[TransactionResponse])
def get_my_transactions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        return db.query(Transaction).filter(Transaction.user_id == current_user.id).order_by(Transaction.timestamp.desc()).all()
    except Exception as e:
        return [{
            "id": 9999,
            "receiver_account": f"ERROR: {str(e)}",
            "amount": 0.0,
            "transaction_type": "error",
            "location": "system",
            "is_fraud": True,
            "timestamp": datetime.datetime.utcnow()
        }]
