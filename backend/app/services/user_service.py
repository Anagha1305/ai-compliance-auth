from datetime import datetime, timezone

from app.database.mongodb import db


users_collection = db["users"]
ALLOWED_ROLES = {"officer", "manufacturer", "consumer"}


def validate_role(role: str) -> str:
    normalized_role = role.strip() if isinstance(role, str) else ""
    if normalized_role not in ALLOWED_ROLES:
        raise ValueError("role must be one of: officer, manufacturer, consumer")
    return normalized_role


def validate_role_identity(role: str, government_id: str | None = None, company_id: str | None = None):
    """Validate and normalize the identity fields for a signup role."""
    normalized_role = validate_role(role)
    normalized_government_id = government_id.strip() if government_id else None
    normalized_company_id = company_id.strip() if company_id else None

    if normalized_role == "officer":
        if not normalized_government_id:
            raise ValueError("government_id is required for officer registration")
        if normalized_company_id:
            raise ValueError("company_id is not allowed for officer registration")
    elif normalized_role == "manufacturer":
        if not normalized_company_id:
            raise ValueError("company_id is required for manufacturer registration")
        if normalized_government_id:
            raise ValueError("government_id is not allowed for manufacturer registration")
    elif normalized_government_id or normalized_company_id:
        raise ValueError("government_id and company_id are not allowed for consumer registration")

    return normalized_role, normalized_government_id, normalized_company_id


def get_user_by_email(email: str):
    return users_collection.find_one({"email": email.lower()})


def create_user(
    name: str,
    email: str,
    password_hash: str,
    role: str,
    government_id: str | None = None,
    company_id: str | None = None,
):
    role, government_id, company_id = validate_role_identity(role, government_id, company_id)
    now = datetime.now(timezone.utc)

    user = {
        "name": name,
        "email": email.lower(),
        "password_hash": password_hash,
        "auth_provider": "email",
        "google_sub": None,
        "email_verified": True,
        "role": role,
        "government_id": government_id,
        "company_id": company_id,
        # Kept flexible for the main backend to populate with document metadata later.
        "document": None,
        "created_at": now,
        "updated_at": now,
    }

    result = users_collection.insert_one(user)

    user["_id"] = result.inserted_id

    return user

def create_google_user(
    name: str,
    email: str,
    google_sub: str,
    role: str,
    government_id: str | None = None,
    company_id: str | None = None,
):
    role, government_id, company_id = validate_role_identity(role, government_id, company_id)
    now = datetime.now(timezone.utc)

    user = {
        "name": name,
        "email": email.lower(),
        "password_hash": None,
        "auth_provider": "google",
        "google_sub": google_sub,
        "email_verified": True,
        "role": role,
        "government_id": government_id,
        "company_id": company_id,
        "document": None,
        "created_at": now,
        "updated_at": now,
    }

    result = users_collection.insert_one(user)

    user["_id"] = result.inserted_id

    return user
