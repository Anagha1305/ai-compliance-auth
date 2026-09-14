from fastapi import HTTPException, Request
from bson import ObjectId

from app.database.mongodb import db
from app.services.jwt_service import decode_access_token


users_collection = db["users"]


def get_current_user(request: Request):

    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired session"
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid session"
        )

    try:
        object_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid user ID"
        )

    user = users_collection.find_one({
        "_id": object_id
    })

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    print("DEBUG USER FROM MONGODB:", user)

    return user