from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException

def resolve_biller_endpoint(biller_id: str, db: Session) -> str:
    result = db.execute(
        text("""
            SELECT biller_endpoint, status
            FROM biller_registry
            WHERE biller_id = :id
        """),
        {"id": biller_id}
    ).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail=f"Biller {biller_id} not found")
    if result.status != "ACTIVE":
        raise HTTPException(status_code=409, detail=f"Biller {biller_id} is not ACTIVE (status: {result.status})")
    if not result.biller_endpoint:
        raise HTTPException(status_code=409, detail=f"Biller {biller_id} has no registered endpoint")

    return result.biller_endpoint