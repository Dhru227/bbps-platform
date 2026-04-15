from __future__ import annotations

from pydantic import BaseModel, Field


class OnboardingProfile(BaseModel):
    legal_entity_type: str = Field(..., description="Entity type (Pvt Ltd, LLP, Society, etc.)")
    industry_category: str = Field(..., description="Business category for BBPS mapping")
    biller_size: str = Field(..., description="micro | small | medium | large")
    biller_mode: str = Field(..., description="online | offline | hybrid")
    operating_coverage: str = Field(..., description="State-wise or all-India")
    monthly_bill_volume_band: str = Field(..., description="Estimated monthly bill volume band")
    tech_maturity: str = Field(..., description="no_api | bou_hosted | own_api")
    expected_tps_band: str = Field(..., description="Expected transactions per second band")


class BOURecommendation(BaseModel):
    bou_type: str
    examples: list[str] = Field(default_factory=list)
    typical_onboarding_time: str
    best_for: str
    score: int = 0


class JourneyHighlight(BaseModel):
    label: str
    value: str
    ok: bool = True


class JourneyStep(BaseModel):
    id: int
    code: str
    title: str
    subtitle: str | None = None
    duration: str | None = None
    description: str | None = None
    highlights: list[JourneyHighlight] = Field(default_factory=list)
    waived_steps: list[str] = Field(default_factory=list)
    tip: str | None = None
    steps: list[str] = Field(default_factory=list)


class SegmentAssessment(BaseModel):
    segment: str
    reason: str


class OnboardingAdvisoryPlan(BaseModel):
    segment: str
    segment_label: str | None = None
    timeline_estimate: str
    required_documents: list[str] = Field(default_factory=list)
    recommended_bous: list[BOURecommendation] = Field(default_factory=list)
    obligations: list[str] = Field(default_factory=list)
    next_10_actions: list[str] = Field(default_factory=list)
    journey_variant: str | None = None
    journey_steps: list[JourneyStep] = Field(default_factory=list)
    journey_summary: dict[str, str] = Field(default_factory=dict)
