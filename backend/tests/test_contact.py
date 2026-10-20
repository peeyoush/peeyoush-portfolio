
import pytest
from fastapi.testclient import TestClient

from app.api.routes import contact as contact_route
from app.core.limiter import limiter
from app.main import app
from app.services.email_service import (
    EmailJSConfigurationError,
    EmailJSDeliveryError,
)


@pytest.fixture(autouse=True)
def reset_rate_limiter():
    """Keep rate-limit state isolated between tests."""
    limiter.reset()
    yield
    limiter.reset()


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def valid_contact():
    return {
        "name": "Ananya Sharma",
        "email": "ananya@example.com",
        "topic": "Internship",
        "message": (
            "I would like to discuss an internship "
            "opportunity with you."
        ),
    }


def test_valid_contact_is_accepted(
    client,
    valid_contact,
    monkeypatch,
):
    received_contact = {}

    async def fake_send_contact_email(contact):
        received_contact["contact"] = contact

    monkeypatch.setattr(
        contact_route,
        "send_contact_email",
        fake_send_contact_email,
    )

    response = client.post(
        "/api/contact",
        json=valid_contact,
    )

    assert response.status_code == 200
    assert response.json() == {
        "status": "accepted",
        "message": "Your message has been submitted successfully.",
    }

    submitted = received_contact["contact"]
    assert submitted.name == "Ananya Sharma"
    assert str(submitted.email) == "ananya@example.com"
    assert submitted.topic == "Internship"


def test_invalid_topic_is_rejected(
    client,
    valid_contact,
):
    valid_contact["topic"] = "Unrelated topic"

    response = client.post(
        "/api/contact",
        json=valid_contact,
    )

    assert response.status_code == 422


def test_invalid_email_is_rejected(
    client,
    valid_contact,
):
    valid_contact["email"] = "not-an-email"

    response = client.post(
        "/api/contact",
        json=valid_contact,
    )

    assert response.status_code == 422


def test_short_message_is_rejected(
    client,
    valid_contact,
):
    valid_contact["message"] = "Too short"

    response = client.post(
        "/api/contact",
        json=valid_contact,
    )

    assert response.status_code == 422


def test_unexpected_field_is_rejected(
    client,
    valid_contact,
):
    valid_contact["unexpected"] = "not allowed"

    response = client.post(
        "/api/contact",
        json=valid_contact,
    )

    assert response.status_code == 422


def test_email_configuration_error_returns_503(
    client,
    valid_contact,
    monkeypatch,
):
    async def fake_send_contact_email(contact):
        raise EmailJSConfigurationError(
            "EmailJS configuration is incomplete."
        )

    monkeypatch.setattr(
        contact_route,
        "send_contact_email",
        fake_send_contact_email,
    )

    response = client.post(
        "/api/contact",
        json=valid_contact,
    )

    assert response.status_code == 503
    assert (
        "temporarily unavailable"
        in response.json()["detail"]
    )


def test_email_delivery_error_returns_502(
    client,
    valid_contact,
    monkeypatch,
):
    async def fake_send_contact_email(contact):
        raise EmailJSDeliveryError(
            "EmailJS could not accept the request."
        )

    monkeypatch.setattr(
        contact_route,
        "send_contact_email",
        fake_send_contact_email,
    )

    response = client.post(
        "/api/contact",
        json=valid_contact,
    )

    assert response.status_code == 502
    assert (
        "couldn't submit your message"
        in response.json()["detail"]
    )


def test_sixth_contact_request_is_rate_limited(
    client,
    valid_contact,
    monkeypatch,
):
    send_count = 0

    async def fake_send_contact_email(contact):
        nonlocal send_count
        send_count += 1

    monkeypatch.setattr(
        contact_route,
        "send_contact_email",
        fake_send_contact_email,
    )

    # The first five requests should be accepted.
    for _ in range(5):
        response = client.post(
            "/api/contact",
            json=valid_contact,
        )
        assert response.status_code == 200

    # The sixth request should be rejected by SlowAPI.
    response = client.post(
        "/api/contact",
        json=valid_contact,
    )

    assert response.status_code == 429
    assert send_count == 5

def test_filled_honeypot_does_not_send_email(
    client,
    valid_contact,
    monkeypatch,
):
    send_count = 0

    async def fake_send_contact_email(contact):
        nonlocal send_count
        send_count += 1

    monkeypatch.setattr(
        contact_route,
        "send_contact_email",
        fake_send_contact_email,
    )

    valid_contact["website"] = "https://spam.example"

    response = client.post(
        "/api/contact",
        json=valid_contact,
    )

    assert response.status_code == 200
    assert response.json()["status"] == "accepted"
    assert send_count == 0
