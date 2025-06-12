from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from db import get_db

router = APIRouter()

@router.get("/staff-checkouts")
def staff_checkout_report(staff: str, db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT
            s.name AS student_name,
            b.title AS book_title,
            b.barcode,
            c.checkout_date,
            s.staff AS staff_name
        FROM checkouts c
        JOIN students s ON c.student_id = s.id
        JOIN books b ON c.book_id = b.id
        WHERE s.staff = :staff
          AND c.return_date IS NULL
        ORDER BY s.name;
    """), {"staff": staff})
    
    return [dict(row._mapping) for row in result]
