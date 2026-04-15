from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db_config import get_db
from services.integrator_handoff import complete_registration

router = APIRouter(prefix="/onboard", tags=["onboarding"])

@router.post("/register")
def register(payload: dict, db: Session = Depends(get_db)):
    session_id = payload.get("session_id")
    biller_endpoint = payload.get("biller_endpoint")
    bou_id = payload.get("bou_id", "BOU001")
    
    if not session_id or not biller_endpoint:
        raise HTTPException(status_code=400, detail="session_id and biller_endpoint required")
        
    try:
        result = complete_registration(session_id, biller_endpoint, bou_id, db)
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))