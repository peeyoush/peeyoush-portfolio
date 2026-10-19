import httpx

from app.core.config import settings
from app.schemas.contact import ContactRequest


EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send"


class EmailJSConfigurationError(Exception):
    """Raised when required EmailJS settings are missing."""


class EmailJSDeliveryError(Exception):
    """Raised when EmailJS cannot accept the email request."""


async def send_contact_email(contact: ContactRequest) -> None:
    """Send a portfolio contact message through EmailJS."""

    required_settings = {
        "Service ID": settings.emailjs_service_id,
        "Template ID": settings.emailjs_template_id,
        "Public Key": settings.emailjs_public_key,
        "Private Key": settings.emailjs_private_key,
    }

    missing_settings = [
        name
        for name, value in required_settings.items()
        if not value
    ]

    if missing_settings:
        raise EmailJSConfigurationError(
            "Missing EmailJS configuration: "
            + ", ".join(missing_settings)
        )

    payload = {
        "service_id": settings.emailjs_service_id,
        "template_id": settings.emailjs_template_id,
        "user_id": settings.emailjs_public_key,
        "accessToken": (
            settings.emailjs_private_key.get_secret_value()
        ),
        "template_params": {
            "name": contact.name,
            "email": str(contact.email),
            "topic": contact.topic,
            "message": contact.message,
        },
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                EMAILJS_SEND_URL,
                json=payload,
            )

    except httpx.TimeoutException as exc:
        raise EmailJSDeliveryError(
            "The email service timed out."
        ) from exc

    except httpx.RequestError as exc:
        raise EmailJSDeliveryError(
            "Could not connect to the email service."
        ) from exc

    if response.status_code != 200:
        raise EmailJSDeliveryError(
            f"EmailJS rejected the request "
            f"with status {response.status_code}."
        )