from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from api.app.core.database import Base
import datetime

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    receiver_account = Column(String)
    amount = Column(Float)
    transaction_type = Column(String)
    location = Column(String)
    is_fraud = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
