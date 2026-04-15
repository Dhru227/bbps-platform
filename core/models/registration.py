from __future__ import annotations

from pydantic import BaseModel, Field


class BillerRegistrationInput(BaseModel):
    """
    Minimal input for registering a biller with the Java biller-integrator.
    Maps 1:1 to bharat.connect.biller.dto.BillerRegistrationRequest.
    Keep this model in sync with that Java DTO — they are a contract.
    """

    entity_name: str = Field(..., min_length=1, description="Biller's trading/legal name")
    bill_category: str = Field(..., min_length=1, description="BBPS category, e.g. EDUCATION")
    customer_params: dict[str, str] = Field(
        ...,
        min_length=1,
        description="Map of identifier name to type, e.g. {'Student ID': 'ALPHANUMERIC'}",
    )
