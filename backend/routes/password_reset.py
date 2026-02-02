from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import uuid

from database import get_db
from models import User, PasswordResetRequest
from schemas.auth import (
    ForgotPasswordRequest,
    VerifyResetCodeRequest,
    ResetPasswordRequest
)
from utils.email import send_reset_email
from utils.security import hash_password
from utils.reset_code import generate_6_digit_code

router = APIRouter(prefix="/auth", tags=["Auth"])

FRONTEND_URL = "http://localhost:5173"

# --------------------------
# Forgot Password Endpoint
# --------------------------
@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    # Do not reveal if email exists
    if not user:
        return {"message": "If this email exists, a reset link was sent."}

    token = uuid.uuid4()
    code = generate_6_digit_code()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    reset_request = PasswordResetRequest(
        user_id=user.id,
        token=token,
        code=code,
        expires_at=expires_at,
        used=False
    )
    db.add(reset_request)
    db.commit()
    db.refresh(reset_request)  # optional

    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    await send_reset_email(user.email, reset_link, code)

    return {"message": "If this email exists, a reset link was sent."}

# --------------------------
# Verify Reset Code
# --------------------------
@router.post("/verify-reset-code")
def verify_reset_code(payload: VerifyResetCodeRequest, db: Session = Depends(get_db)):
    req = db.query(PasswordResetRequest).filter(
        PasswordResetRequest.token == payload.token
    ).first()

    if not req:
        raise HTTPException(status_code=400, detail="Invalid token")

    if req.used:
        raise HTTPException(status_code=400, detail="Token already used")

    # ✅ Compare with timezone-aware datetime
    if datetime.now(timezone.utc) > req.expires_at:
        raise HTTPException(status_code=400, detail="Token expired")

    if req.code != payload.code:
        raise HTTPException(status_code=400, detail="Invalid code")

    return {"message": "Code verified"}

# --------------------------
# Reset Password Endpoint
# --------------------------
@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    req = db.query(PasswordResetRequest).filter(
        PasswordResetRequest.token == payload.token
    ).first()

    if not req:
        raise HTTPException(status_code=400, detail="Invalid token")

    if req.used:
        raise HTTPException(status_code=400, detail="Token already used")

    if datetime.now(timezone.utc) > req.expires_at:
        raise HTTPException(status_code=400, detail="Token expired")

    if req.code != payload.code:
        raise HTTPException(status_code=400, detail="Invalid code")

    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = hash_password(payload.new_password)
    req.used = True

    db.commit()

    return {"message": "Password updated successfully"}
