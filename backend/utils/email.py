import os
from dotenv import load_dotenv
import aiosmtplib
from email.message import EmailMessage

SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME")

async def send_reset_email(to_email: str, reset_link: str, code: str):
    msg = EmailMessage()
    msg["From"] = f"{SMTP_FROM_NAME} <{SMTP_USER}>"
    msg["To"] = to_email
    msg["Subject"] = "Password Reset Request"

    msg.set_content(
        f"""
Hello!

You requested a password reset.

Reset Link:
{reset_link}

Security Code (6 digits):
{code}

This will expire in 10 minutes.

If you did not request this, ignore this email.
"""
    )

    await aiosmtplib.send(
        msg,
        hostname="smtp.gmail.com",
        port=587,
        start_tls=True,
    	username=SMTP_USER,
    	password=SMTP_PASSWORD
    )
