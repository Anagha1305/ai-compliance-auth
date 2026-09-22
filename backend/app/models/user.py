from datetime import datetime, timezone

from typing import Any, Literal

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal["officer", "manufacturer", "consumer"]
    government_id: str | None = None
    company_id: str | None = None
    document: dict[str, Any] | None = None


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    auth_provider: str
    role: str | None = None
    email_verified: bool
    document: dict[str, Any] | None = None
    created_at: datetime
