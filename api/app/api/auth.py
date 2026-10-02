from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.database import users_db, user_id_counter

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

@router.post("/register")
async def register(user: UserCreate):
    global user_id_counter
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_pw = get_password_hash(user.password)
    users_db[user.email] = {
        "id": user_id_counter,
        "name": user.name,
        "email": user.email,
        "hashed_password": hashed_pw,
        "account_balance": 15000.0
    }
    user_id_counter += 1
    return {"message": "User created successfully"}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    
    # Auto-create user if stateless memory was wiped
    if not user:
        global user_id_counter
        hashed_pw = get_password_hash(form_data.password)
        users_db[form_data.username] = {
            "id": user_id_counter,
            "name": "Demo User",
            "email": form_data.username,
            "hashed_password": hashed_pw,
            "account_balance": 15000.0
        }
        user = users_db[form_data.username]
        user_id_counter += 1
    elif not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
        
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer", "user_id": user["id"], "name": user["name"]}
