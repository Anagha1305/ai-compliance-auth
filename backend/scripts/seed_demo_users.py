"""Create development-only role-aware demo accounts without an auth bypass."""

import os
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

from app.services.user_service import create_user, get_user_by_email, users_collection
from app.utils.security import hash_password


DEMO_USERS = (
    {
        "name": "Demo Officer", "email": "demo.officer@demo-company.in", "role": "officer",
        "government_id": "DEMO-GOV-001", "company_id": None, "password_env": "DEMO_OFFICER_PASSWORD",
        "legacy_email": "demo.officer@demo.local",
    },
    {
        "name": "Demo Manufacturer", "email": "demo.manufacturer@demo-company.in", "role": "manufacturer",
        "government_id": None, "company_id": "DEMO-COMP-001", "password_env": "DEMO_MANUFACTURER_PASSWORD",
        "legacy_email": "demo.manufacturer@demo.local",
    },
)


def main() -> None:
    if os.getenv("ENVIRONMENT", "development").lower() == "production":
        raise SystemExit("Refusing to seed demo accounts in production.")

    for demo in DEMO_USERS:
        legacy_user = get_user_by_email(demo["legacy_email"])
        if legacy_user and not get_user_by_email(demo["email"]):
            users_collection.update_one(
                {"_id": legacy_user["_id"]}, {"$set": {"email": demo["email"]}}
            )
            print(f"Updated legacy demo email: {demo['email']}")
            continue
        if get_user_by_email(demo["email"]):
            print(f"Skipped existing demo user: {demo['email']}")
            continue
        password = os.getenv(demo["password_env"])
        if not password:
            raise SystemExit(f"Set {demo['password_env']} before seeding demo users.")
        create_user(
            name=demo["name"], email=demo["email"], password_hash=hash_password(password),
            role=demo["role"], government_id=demo["government_id"], company_id=demo["company_id"],
        )
        print(f"Created demo {demo['role']}: {demo['email']}")


if __name__ == "__main__":
    main()
