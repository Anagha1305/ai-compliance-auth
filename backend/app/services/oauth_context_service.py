import secrets
from datetime import datetime, timedelta, timezone

from app.database.mongodb import db


oauth_contexts = db["oauth_auth_contexts"]
# MongoDB removes expired contexts automatically; expiry is also checked on read
# because TTL cleanup is asynchronous.
oauth_contexts.create_index("expires_at", expireAfterSeconds=0)


def create_google_auth_context(
    role: str,
    mode: str,
    government_id: str | None = None,
    company_id: str | None = None,
) -> str:
    """Persist short-lived OAuth context; only its opaque ID enters the session cookie."""
    context_id = secrets.token_urlsafe(32)
    now = datetime.now(timezone.utc)
    oauth_contexts.insert_one({
        "context_id": context_id,
        "role": role,
        "mode": mode,
        "government_id": government_id,
        "company_id": company_id,
        "expires_at": now + timedelta(minutes=10),
        "created_at": now,
    })
    return context_id


def consume_google_auth_context(context_id: str | None):
    if not context_id:
        return None
    context = oauth_contexts.find_one_and_delete({"context_id": context_id})
    if not context:
        return None
    expires_at = context["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None
    return context
