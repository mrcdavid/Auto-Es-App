from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, func
from database import Base
from database import engine
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy import Enum

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



     # relationships
    reset_requests = relationship(
        "PasswordResetRequest",
        back_populates="user",
        cascade="all, delete"
    )

    orders = relationship(
        "Order",
        back_populates="user",
        cascade="all, delete"
    )



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
    


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="RESTRICT"), nullable=False)

    order_type = Column(String, nullable=False)
    order_place = Column(String, nullable=False)
    quotation_total_price = Column(Float, nullable=False)

    status = Column(
        Enum("ONGOING", "CANCELLED", "PENDING", "COMPLETED", name="order_status_enum"),
        nullable=False,
        server_default="ONGOING"
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # relationships
    user = relationship("User", back_populates="orders")
    customer = relationship("Customer", back_populates="orders")



class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    customer_code = Column(String, unique=True, nullable=False)  # your CLIENT ID
    name = Column(String, nullable=False)
    contact_number = Column(String, nullable=True)
    address = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # relationships
    orders = relationship(
        "Order",
        back_populates="customer",
        cascade="all, delete"
    )


Base.metadata.create_all(bind=engine)
