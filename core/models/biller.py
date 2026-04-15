from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BillerBase(BaseModel):
    biller_name: str
    category: str

class BillerCreate(BillerBase):
    pass

class BillerRecord(BillerBase):
    biller_id: str
    biller_endpoint: Optional[str] = None
    assigned_bou_id: Optional[str] = None
    status: str = "PENDING"
    created_at: Optional[datetime] = None
    activated_at: Optional[datetime] = None

    class Config:
        from_attributes = True