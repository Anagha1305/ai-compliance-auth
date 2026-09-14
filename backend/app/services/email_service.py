import smtplib
from email.message import EmailMessage
import os

from dotenv import load_dotenv


load_dotenv()


EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_USERNAME = os.getenv("EMAIL_USERNAME")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def send_otp_email(to_email: str, otp: str):
    message = EmailMessage()

    message["Subject"] = "AI Compliance Inspector - Email Verification"
    message["From"] = EMAIL_USERNAME
    message["To"] = to_email

    message.set_content(
        f"""
Hello,

Your verification code for AI Compliance Inspector is:

{otp}

This code is valid for 5 minutes.

If you did not request this code, please ignore this email.

Regards,
AI Compliance Inspector Team
"""
    )

    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        server.starttls()
        server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
        server.send_message(message)