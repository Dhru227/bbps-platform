from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from db_config import get_db

bou_router = APIRouter(prefix="/bou", tags=["bou"])

@bou_router.post("/register-biller")
def register_biller_with_bou(payload: dict, db: Session = Depends(get_db)):
    biller_id = payload.get("biller_id")
    bou_id = payload.get("ou_id", "BOU001")
    biller_endpoint = payload.get("biller_endpoint")

    # 1. Map the Biller to the BOU
    db.execute(
        text("""
            INSERT INTO bou_biller_mapping (biller_id, bou_id, mapped_at, confirmed_at, is_active)
            VALUES (:bid, :bou, NOW(), NOW(), TRUE)
        """),
        {"bid": biller_id, "bou": bou_id}
    )
    
    # 2. Activate the Biller
    db.execute(
        text("""
            UPDATE biller_registry
            SET status = 'ACTIVE', biller_endpoint = :ep, activated_at = NOW()
            WHERE biller_id = :id
        """),
        {"ep": biller_endpoint, "id": biller_id}
    )
    db.commit()
    return {"status": "registered", "biller_id": biller_id, "bou_id": bou_id}