import os
import httpx
import json
from sqlalchemy.orm import Session
from sqlalchemy import text
from core.services.biller_registry import register_biller

def extract_from_history(history: list, field: str) -> str:
    for entry in history:
        if entry.get("field") == field:
            return entry.get("value", "Unknown")
    return "Unknown"

def complete_registration(session_id: str, biller_endpoint: str, bou_id: str, db: Session, biller_name: str = None, category: str = None) -> dict:
    # 1. Load session
    session = db.execute(
        text("SELECT * FROM onboarding_sessions WHERE session_id = :sid"),
        {"sid": session_id}
    ).fetchone()
    if not session:
        raise ValueError("Session not found")

    # 2. Extract collected fields from chat history
    #history = json.loads(session.chat_history) if session.chat_history else []
    raw = session.chat_history
    history = raw if isinstance(raw, list) else (json.loads(raw) if raw else [])
    biller_name = biller_name or extract_from_history(history, "biller_name")
    category = category or extract_from_history(history, "category")

    if biller_name == "Unknown" or category == "Unknown":
         raise ValueError("Cannot register: Biller name or category was not extracted by the AI.")

    # 3. Verify BOU exists
    bou = db.execute(
        text("SELECT * FROM bou_registry WHERE bou_id = :id AND is_active = TRUE"),
        {"id": bou_id}
    ).fetchone()
    if not bou:
        raise ValueError(f"BOU {bou_id} not found or inactive")

    # 4. Heartbeat check on biller integrator
    # Heartbeat check skipped for POC — integrator /heartbeat calls simulator
    # ReqHbt endpoint which is not implemented in the simulator
    try:
        httpx.get(biller_endpoint, timeout=5)
    except httpx.ConnectError:
        raise ValueError(f"Cannot reach integrator at {biller_endpoint}. Is it running?")

    # 5. Generate biller_id and write PENDING record
    biller_id = register_biller(biller_name, category, db)

    # 6. POST BOU handshake
    payload = {
        "biller_endpoint": biller_endpoint,
        "biller_name": biller_name,
        "biller_id": biller_id,
        "category": category,
        "ou_id": bou_id
    }
    
    platform_url = os.getenv("PLATFORM_BASE_URL", "http://localhost:8000")
    r = httpx.post(f"{platform_url}/bou/register-biller", json=payload, timeout=5)
    if r.status_code != 200:
        raise ValueError(f"BOU handshake failed: {r.text}")

    return {"biller_id": biller_id, "status": "ACTIVE", "bou_assigned": bou_id}