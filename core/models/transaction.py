from pydantic import BaseModel
from typing import Optional, Dict, Any

class BillFetchRequest(BaseModel):
    biller_id: str
    customer_params: Dict[str, Any]

class BillFetchResponse(BaseModel):
    bill_amount: float
    due_date: str
    bill_number: str
    customer_name: str
    status: str

class BillPaymentRequest(BaseModel):
    biller_id: str
    bill_id: str
    amount: float
    payment_mode: str = "UPI"

class BillPaymentResponse(BaseModel):
    txn_ref: str
    status: str
    amount_paid: float
    timestamp: str