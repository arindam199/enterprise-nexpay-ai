from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import models
from database import engine, get_db
from pydantic import BaseModel
from typing import List
from ai.predict import predict_fraud
from ai.train_model import train_and_save

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fintech AI Fraud Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return RedirectResponse(url="/static/index.html")

class UserCreate(BaseModel):
    name: str
    email: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    account_balance: float

    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    user_id: int
    amount: float
    transaction_type: str
    location: str

class TransactionResponse(BaseModel):
    id: int
    user_id: int
    amount: float
    transaction_type: str
    location: str
    is_fraud: bool

    class Config:
        from_attributes = True

@app.on_event("startup")
def startup_event():
    import os
    if not os.path.exists("ai/fraud_model.pkl"):
        train_and_save()

@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(name=user.name, email=user.email, account_balance=10000.0)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/transactions/", response_model=TransactionResponse)
def create_transaction(tx: TransactionCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == tx.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    is_fraud = predict_fraud(tx.amount, tx.transaction_type, tx.location)
    
    db_tx = models.Transaction(
        user_id=tx.user_id,
        amount=tx.amount,
        transaction_type=tx.transaction_type,
        location=tx.location,
        is_fraud=is_fraud
    )
    db.add(db_tx)
    
    if not is_fraud:
        user.account_balance -= tx.amount
        
    db.commit()
    db.refresh(db_tx)
    return db_tx

@app.get("/transactions/", response_model=List[TransactionResponse])
def get_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactions
