from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.transaction import Transaction
from app.models.user import User
from app.api.auth import oauth2_scheme
from jose import jwt
from app.core.config import SECRET_KEY, ALGORITHM
from pydantic import BaseModel
from typing import List
from ai.predict import predict_fraud
import datetime

router = APIRouter()

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
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

    class Config:
        from_attributes = True

@router.post("/", response_model=TransactionResponse)
async def create_transaction(tx: TransactionCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    is_fraud = await predict_fraud(current_user.id, tx.amount, tx.transaction_type, tx.location, db)
    
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
        
    await db.commit()
    await db.refresh(new_tx)
    return new_tx

@router.get("/", response_model=List[TransactionResponse])
async def get_my_transactions(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Transaction).where(Transaction.user_id == current_user.id).order_by(Transaction.timestamp.desc())
    )
    return result.scalars().all()
