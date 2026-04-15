import uuid
import json
from sqlalchemy import text
from sqlalchemy.orm import Session
from services.llm_provider import call_llm


def create_session(db: Session) -> str:
    session_id = str(uuid.uuid4())
    db.execute(
        text("""
            INSERT INTO onboarding_sessions (session_id, stage, chat_history, created_at, updated_at)
            VALUES (:sid, 'START', CAST('[]' AS JSONB), NOW(), NOW())
        """),
        {"sid": session_id}
    )
    db.commit()
    return session_id


def update_session(session_id: str, stage: str, history: list, db: Session):
    db.execute(
        text("""
            UPDATE onboarding_sessions
            SET stage = :stage, chat_history = CAST(:history AS JSONB), updated_at = NOW()
            WHERE session_id = :sid
        """),
        {"stage": stage, "history": json.dumps(history), "sid": session_id}
    )
    db.commit()


def process_chat_message(session_id: str, message: str, db: Session) -> str:
    # 1. Fetch session
    session = db.execute(
        text("SELECT * FROM onboarding_sessions WHERE session_id = :sid"),
        {"sid": session_id}
    ).fetchone()

    if not session:
        raise ValueError("Session not found")

    # 2. Load history and append new user message
    raw = session.chat_history
    history = raw if isinstance(raw, list) else (json.loads(raw) if raw else [])

    llm_messages = [
        {"role": msg["role"], "content": msg["content"]}
        for msg in history
        if msg["role"] in ("user", "assistant")
    ]
    llm_messages.append({"role": "user", "content": message})
    history.append({"role": "user", "content": message, "field": "none"})

    # 3. System prompt
    system_prompt = """
You are the BBPS Onboarding Assistant. Your goal is to collect exactly two pieces of information:
1. Biller Name (e.g., "Reliance Jio", "Tata Power")
2. Category — must be exactly one of: Electricity, Water, Gas, Telecom, Insurance, Other

Be conversational and polite. Once you have BOTH pieces of information confirmed, reply with a
short confirmation message and append this exact string at the very end of your response:
[SYSTEM_EXTRACTION: {"biller_name": "extracted_name", "category": "extracted_category"}]

Do not append [SYSTEM_EXTRACTION] until you have both pieces confirmed.
"""

    # 4. Call whichever LLM is configured (Ollama or OpenRouter)
    reply_text = call_llm(system_prompt, llm_messages, max_tokens=300)

    # 5. Check for extraction marker
    stage = session.stage
    if "[SYSTEM_EXTRACTION:" in reply_text:
        stage = "COLLECTED"
        try:
            extraction_str = reply_text.split("[SYSTEM_EXTRACTION:")[1].strip().rstrip("]")
            extracted_data = json.loads(extraction_str)
            history.append({
                "role": "system", "content": "extracted",
                "field": "biller_name", "value": extracted_data.get("biller_name")
            })
            history.append({
                "role": "system", "content": "extracted",
                "field": "category", "value": extracted_data.get("category")
            })
        except Exception:
            pass  # Parsing failed — chat continues, extraction retried next turn

        reply_text = reply_text.split("[SYSTEM_EXTRACTION:")[0].strip()

    # 6. Save assistant reply and update DB
    history.append({"role": "assistant", "content": reply_text})
    update_session(session_id, stage, history, db)

    return reply_text