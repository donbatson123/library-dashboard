from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
import requests

router = APIRouter()

@router.get("/search")
def search_students(q: str, db: Session = Depends(get_db)):
    return db.execute("""
        SELECT * FROM students
        WHERE LOWER(first_name) LIKE LOWER(%(term)s)
           OR LOWER(last_name) LIKE LOWER(%(term)s)
           OR student_id::text LIKE %(term)s
        LIMIT 20
    """, {"term": f"%{q}%"}).fetchall()
