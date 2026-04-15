import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db_config import get_db
from core.models.transaction import BillFetchRequest, BillPaymentRequest
from core.services.routing import resolve_biller_endpoint

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.post("/fetch")
def fetch_bill(request: BillFetchRequest, db: Session = Depends(get_db)):
    # Uses Phase 2 logic to find the integrator URL
    endpoint = resolve_biller_endpoint(request.biller_id, db)
    url = f"{endpoint}/mock-biller/{request.biller_id}/fetch"
    
    try:
        r = httpx.post(url, json=request.customer_params, timeout=10)
        r.raise_for_status()
        return r.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"Integrator error: {e.response.status_code}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Integrator unreachable: {e}")

@router.post("/payment")
def pay_bill(request: BillPaymentRequest, db: Session = Depends(get_db)):
    endpoint = resolve_biller_endpoint(request.biller_id, db)
    url = f"{endpoint}/mock-biller/{request.biller_id}/payment"
    
    payload = {
        "bill_id": request.bill_id,
        "amount": request.amount,
        "payment_mode": request.payment_mode
    }
    
    try:
        r = httpx.post(url, json=payload, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))