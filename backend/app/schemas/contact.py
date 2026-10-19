
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


ContactTopic = Literal[
    "Internship",
    "Job opportunity",
    "Collaboration",
    "Project discussion",
    "Other",
]


class ContactRequest(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )

    name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    topic: ContactTopic
    message: str = Field(min_length=20, max_length=2000)


class ContactResponse(BaseModel):
    status: Literal["accepted"]
    message: str
