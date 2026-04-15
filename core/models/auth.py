"""Auth context model."""
from __future__ import annotations
from typing import Literal, List
from pydantic import BaseModel, Field


class AuthContext(BaseModel):
    sub: str = Field(..., description="Consumer user ID")
    app_id: str = Field(..., description="Consuming application ID")
    scope: List[str] = Field(default_factory=lambda: ["bill:read"])
    kyc_level: Literal["min", "full"] = "min"
    preferred_language: str = "en-IN"

    def has_scope(self, required: str) -> bool:
        return required in self.scope
