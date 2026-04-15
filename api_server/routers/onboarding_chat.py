from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db_config import get_db

# Assuming your orchestrator has a main chat processing function like this:
from services.onboarding_chat_orchestrator import create_session, process_chat_message

router = APIRouter(prefix="/onboard", tags=["onboarding"])

class ChatRequest(BaseModel):
    session_id: str
    message: str

@router.post("/start")
def start_onboarding(db: Session = Depends(get_db)):
    session_id = create_session(db)
    return {"session_id": session_id, "message": "Welcome to BBPS Biller Onboarding. What is the name of your organization?"}

@router.post("/chat")
def chat_onboarding(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        # Call the orchestrator logic you just adapted
        reply = process_chat_message(request.session_id, request.message, db)
        return {"session_id": request.session_id, "reply": reply}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))