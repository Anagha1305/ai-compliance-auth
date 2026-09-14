from datetime import datetime, timezone

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    auth_provider: str
    role: str
    email_verified: bool
    created_at: datetime