from datetime import datetime, timedelta, timezone

from app.database.mongodb import db
from app.utils.otp import generate_otp
from app.utils.security import hash_otp, verify_otp


verification_codes = db["verification_codes"]
email_verifications = db["email_verifications"]


def create_otp(email: str):
    otp = generate_otp()
    otp_hash = hash_otp(otp)

    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(minutes=5)

    verification_codes.delete_many({
        "email": email.lower()
    })

    verification_codes.insert_one({
        "email": email.lower(),
        "code_hash": otp_hash,
        "expires_at": expires_at,
        "attempts": 0,
        "created_at": now,
    })

    return otp


def verify_email_otp(email: str, otp: str) -> bool:
    email = email.lower()

    record = verification_codes.find_one({
        "email": email
    })

    if not record:
        return False

    expires_at = record["expires_at"]

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(
            tzinfo=timezone.utc
        )

    now = datetime.now(timezone.utc)

    if expires_at < now:
        verification_codes.delete_one({
            "_id": record["_id"]
        })
        return False

    if record["attempts"] >= 5:
        return False

    verification_codes.update_one(
        {"_id": record["_id"]},
        {"$inc": {"attempts": 1}}
    )

    if verify_otp(otp, record["code_hash"]):

        # Remove the used OTP
        verification_codes.delete_one({
            "_id": record["_id"]
        })

        # Mark email as verified
        email_verifications.update_one(
            {"email": email},
            {
                "$set": {
                    "email": email,
                    "verified_at": now,
                }
            },
            upsert=True
        )

        return True

    return False


def is_email_verified(email: str) -> bool:
    email = email.lower()

    record = email_verifications.find_one({
        "email": email
    })

    if not record:
        return False

    return True


def remove_email_verification(email: str):
    email_verifications.delete_one({
        "email": email.lower()
    })