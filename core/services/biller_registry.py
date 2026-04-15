import hashlib
from sqlalchemy.orm import Session
from sqlalchemy import text

CATEGORY_CODES = {
    "Electricity": "ELC",
    "Water": "WTR",
    "Gas": "GAS",
    "Telecom": "TEL",
    "Insurance": "INS",
    "Other": "OTH",
}

def generate_biller_id(category: str, db: Session) -> str:
    code = CATEGORY_CODES.get(category, "OTH")
    result = db.execute(
        text("SELECT COUNT(*) FROM biller_registry WHERE category = :cat"),
        {"cat": category}
    ).scalar()
    seq = str(result + 1).zfill(7)
    raw = f"{code}{seq}"
    checksum = hashlib.md5(raw.encode()).hexdigest()[:4].upper()
    return f"{raw}{checksum}"

def register_biller(biller_name: str, category: str, db: Session) -> str:
    biller_id = generate_biller_id(category, db)
    db.execute(
        text("""
            INSERT INTO biller_registry (biller_id, biller_name, category, status, created_at)
            VALUES (:id, :name, :cat, 'PENDING', NOW())
        """),
        {"id": biller_id, "name": biller_name, "cat": category}
    )
    db.commit()
    return biller_id