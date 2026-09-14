import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.routes.auth import router as auth_router

load_dotenv()

app = FastAPI(
    title="AI Compliance Inspector API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET"),
    session_cookie="oauth_session",
    same_site="lax",
    https_only=False,
)

app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "AI Compliance Inspector API is running"
    }