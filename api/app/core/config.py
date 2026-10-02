import os

SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_enterprise_jwt_key_that_is_very_long")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
DATABASE_URL = "sqlite+aiosqlite:///./fintech_enterprise.db"
