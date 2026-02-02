from pydantic import BaseModel, EmailStr, Field

# ----------------------------
# User registration & response
# ----------------------------
class UserCreate(BaseModel):
    first_Name: str
    last_Name: str 
    username: str
    password: str
    email: EmailStr

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    first_Name: str
    last_Name: str
    username: str
    email: EmailStr

    class Config:
        from_attributes = True

# ----------------------------
# Password reset
# ----------------------------
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyResetCodeRequest(BaseModel):
    token: str
    code: str = Field(min_length=6, max_length=6)

class ResetPasswordRequest(BaseModel):
    token: str
    code: str = Field(min_length=6, max_length=6)
    new_password: str = Field(min_length=8)
