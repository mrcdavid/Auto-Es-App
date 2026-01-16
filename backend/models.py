from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from database import Base
from database import engine

# class User(Base):
#     __tablename__ = "users"


#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String, unique=True, index=True)
#     hashed_password = Column(String)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_Name = Column(String, nullable=True)   # optional first name
    last_Name = Column(String, nullable=True)    # optional last name
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

Base.metadata.create_all(bind=engine)
