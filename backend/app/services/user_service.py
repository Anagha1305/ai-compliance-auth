from datetime import datetime, timezone

from app.database.mongodb import db


users_collection = db["users"]


def get_user_by_email(email: str):
    return users_collection.find_one({"email": email.lower()})


def create_user(
    name: str,
    email: str,
    password_hash: str,
):
    now = datetime.now(timezone.utc)

    user = {
        "name": name,
        "email": email.lower(),
        "password_hash": password_hash,
        "auth_provider": "email",
        "google_sub": None,
        "email_verified": True,
        "role": "officer",
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
):
    now = datetime.now(timezone.utc)

    user = {
        "name": name,
        "email": email.lower(),
        "password_hash": None,
        "auth_provider": "google",
        "google_sub": google_sub,
        "email_verified": True,
        "role": "officer",
        "created_at": now,
        "updated_at": now,
    }

    result = users_collection.insert_one(user)

    user["_id"] = result.inserted_id

    return user