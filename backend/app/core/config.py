
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Peeyoush Portfolio API"
    environment: str = "development"

    frontend_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # EmailJS configuration
    emailjs_service_id: str | None = None
    emailjs_template_id: str | None = None
    emailjs_public_key: str | None = None
    emailjs_private_key: SecretStr | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )


settings = Settings()
