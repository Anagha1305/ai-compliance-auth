import os

from fastapi import APIRouter, HTTPException, Response, Depends, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr

from app.services.google_auth import oauth

from app.services.user_service import (
    get_user_by_email,
    create_user,
    create_google_user,
)

from app.services.jwt_service import create_access_token

from app.services.otp_service import (
    create_otp,
    verify_email_otp,
    is_email_verified,
    remove_email_verification,
)

from app.services.email_service import send_otp_email

from app.utils.security import hash_password, verify_password
from app.utils.auth_dependency import get_current_user


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


# ============================================================
# REQUEST MODELS
# ============================================================

class SendOTPRequest(BaseModel):
    email: EmailStr


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ============================================================
# SEND OTP
# ============================================================

@router.post("/send-otp")
def send_otp(request: SendOTPRequest):

    email = request.email.lower()

    otp = create_otp(email)

    try:
        send_otp_email(email, otp)

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to send verification email"
        )

    return {
        "message": "Verification code sent successfully"
    }


# ============================================================
# VERIFY OTP
# ============================================================

@router.post("/verify-otp")
def verify_otp(request: VerifyOTPRequest):

    email = request.email.lower()

    is_valid = verify_email_otp(
        email,
        request.otp
    )

    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired verification code"
        )

    return {
        "message": "Email verified successfully"
    }


# ============================================================
# REGISTER
# ============================================================

@router.post("/register")
def register(
    request: RegisterRequest,
    response: Response
):

    email = request.email.lower()

    # 1. Check whether email was verified
    if not is_email_verified(email):
        raise HTTPException(
            status_code=400,
            detail="Email has not been verified"
        )

    # 2. Check whether user already exists
    existing_user = get_user_by_email(email)

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists"
        )

    # 3. Hash password
    password_hash = hash_password(
        request.password
    )

    # 4. Create user
    user = create_user(
        name=request.name,
        email=email,
        password_hash=password_hash,
    )

    # 5. Remove temporary email verification record
    remove_email_verification(email)

    # 6. Create JWT
    access_token = create_access_token(
        str(user["_id"])
    )

    # 7. Store JWT in HttpOnly cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,       # True in production with HTTPS
        samesite="lax",
        max_age=30 * 60,
    )

    return {
        "message": "Account created successfully",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
        }
    }


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login(
    request: LoginRequest,
    response: Response
):

    email = request.email.lower()

    # 1. Find user
    user = get_user_by_email(email)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # 2. Verify password
    if not verify_password(
        request.password,
        user["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # 3. Create JWT
    access_token = create_access_token(
        str(user["_id"])
    )

    # 4. Store JWT in HttpOnly cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,       # True in production with HTTPS
        samesite="lax",
        max_age=30 * 60,
    )

    return {
        "message": "Login successful",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "auth_provider": user["auth_provider"],
            "email_verified": user["email_verified"],
        }
    }


# ============================================================
# CURRENT USER
# ============================================================

@router.get("/me")
def get_me(
    current_user=Depends(get_current_user)
):

    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"],
        "auth_provider": current_user["auth_provider"],
        "email_verified": current_user["email_verified"],
    }


# ============================================================
# PROTECTED TEST
# ============================================================

@router.get("/protected-test")
def protected_test(
    current_user=Depends(get_current_user)
):

    return {
        "message": "You are authenticated!",
        "user": {
            "id": str(current_user["_id"]),
            "name": current_user["name"],
            "email": current_user["email"],
            "role": current_user["role"],
        }
    }


# ============================================================
# LOGOUT
# ============================================================

@router.post("/logout")
def logout(response: Response):

    response.delete_cookie(
        key="access_token"
    )

    return {
        "message": "Logout successful"
    }


# ============================================================
# GOOGLE LOGIN
# ============================================================

@router.get("/google")
async def google_login(request: Request):

    redirect_uri = os.getenv(
        "GOOGLE_REDIRECT_URI"
    )

    return await oauth.google.authorize_redirect(
        request,
        redirect_uri
    )


# ============================================================
# GOOGLE CALLBACK
# ============================================================

@router.get("/google/callback")
async def google_callback(
    request: Request
):

    # 1. Exchange Google's authorization code
    #    for an access/id token
    try:
        token = await oauth.google.authorize_access_token(
            request
        )

    except Exception as e:

        print(
            "GOOGLE OAUTH ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=400,
            detail=f"Google authentication failed: {str(e)}"
        )

    # 2. Get Google user information
    user_info = token.get("userinfo")

    if not user_info:
        raise HTTPException(
            status_code=400,
            detail="Unable to retrieve Google user information"
        )

    # 3. Extract Google account information
    google_sub = user_info.get("sub")
    email = user_info.get("email")
    name = user_info.get("name")

    if not google_sub or not email:
        raise HTTPException(
            status_code=400,
            detail="Google account information is incomplete"
        )

    email = email.lower()

    # 4. Check whether user already exists
    user = get_user_by_email(email)

    if user:

        # Existing user
        user_id = str(user["_id"])

    else:

        # 5. Create new Google user
        user = create_google_user(
            name=name or "Google User",
            email=email,
            google_sub=google_sub,
        )

        user_id = str(user["_id"])

    # 6. Create JWT
    access_token = create_access_token(
        user_id
    )

    # 7. Redirect to frontend
    response = RedirectResponse(
        url=os.getenv("FRONTEND_URL")
    )

    # 8. Store JWT in HttpOnly cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,       # True in production with HTTPS
        samesite="lax",
        max_age=30 * 60,
    )

    return response