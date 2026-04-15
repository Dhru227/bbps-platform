from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
import httpx
from db_config import get_db

router = APIRouter(prefix="/billers", tags=["billers"])

@router.get("")
def list_billers(db: Session = Depends(get_db)):
    rows = db.execute(text("SELECT * FROM biller_registry ORDER BY created_at DESC")).fetchall()
    return [dict(r._mapping) for r in rows]

@router.get("/{biller_id}")
def get_biller(biller_id: str, db: Session = Depends(get_db)):
    row = db.execute(
        text("SELECT * FROM biller_registry WHERE biller_id = :id"),
        {"id": biller_id}
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Biller not found")
    return dict(row._mapping)

@router.put("/{biller_id}/endpoint")
def update_endpoint(biller_id: str, payload: dict, db: Session = Depends(get_db)):
    endpoint = payload.get("biller_endpoint")
    if not endpoint:
        raise HTTPException(status_code=400, detail="biller_endpoint required")
    try:
        r = httpx.get(f"{endpoint}/heartbeat", timeout=5)
        if r.status_code != 200:
            raise HTTPException(status_code=502, detail="Integrator heartbeat failed")
    except httpx.RequestError:
        raise HTTPException(status_code=502, detail="Could not reach integrator endpoint")
    db.execute(
        text("UPDATE biller_registry SET biller_endpoint = :ep WHERE biller_id = :id"),
        {"ep": endpoint, "id": biller_id}
    )
    db.commit()
    return {"biller_id": biller_id, "biller_endpoint": endpoint, "status": "updated"}