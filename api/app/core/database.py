import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "")

# Convert standard postgres URL to asyncpg
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Fallback to in-memory if no env variable is set (so it doesn't crash if they forget to add it)
if not DATABASE_URL:
    DATABASE_URL = "sqlite+aiosqlite:///file:memdb1?mode=memory&cache=shared&uri=true"
    from sqlalchemy.pool import StaticPool
    engine = create_async_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False}, poolclass=StaticPool)
else:
    engine = create_async_engine(DATABASE_URL, echo=False)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
