from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func
from database import Base
from database import engine
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

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


 # optional: relationship to reset requests
    reset_requests = relationship("PasswordResetRequest", back_populates="user", cascade="all, delete")


class PasswordResetRequest(Base):
    __tablename__ = "password_reset_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
    code = Column(String(6), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # relationship back to user
    user = relationship("User", back_populates="reset_requests")
    

Base.metadata.create_all(bind=engine)
