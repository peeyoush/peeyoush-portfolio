
import logging

from fastapi import APIRouter, HTTPException, status

from app.schemas.contact import ContactRequest, ContactResponse
from app.services.email_service import (
    EmailJSConfigurationError,
    EmailJSDeliveryError,
    send_contact_email,
)


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post(
    "",
    response_model=ContactResponse,
    status_code=status.HTTP_200_OK,
)
async def submit_contact_message(
    contact: ContactRequest,
) -> ContactResponse:
    """Validate and submit a portfolio contact message."""

    try:
        await send_contact_email(contact)

    except EmailJSConfigurationError as exc:
        logger.error("EmailJS configuration error: %s", exc)

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "The contact form is temporarily unavailable. "
                "Please try again later."
            ),
        ) from exc

    except EmailJSDeliveryError as exc:
        logger.warning("EmailJS request failed: %s", exc)

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "We couldn't submit your message right now. "
                "Please try again later."
            ),
        ) from exc

    return ContactResponse(
        status="accepted",
        message="Your message has been submitted successfully.",
    )
