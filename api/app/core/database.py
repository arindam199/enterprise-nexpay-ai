import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool

# Fallback to shared in-memory SQLite for perfectly reliable Vercel stateless deployments
DATABASE_URL = "sqlite+aiosqlite:///file:memdb1?mode=memory&cache=shared&uri=true"
engine = create_async_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False}, poolclass=StaticPool)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

_tables_created = False

async def get_db():
    global _tables_created
    if not _tables_created:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        _tables_created = True
        
    async with AsyncSessionLocal() as session:
        yield session
