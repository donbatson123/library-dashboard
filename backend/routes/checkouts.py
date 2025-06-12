from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
from sqlalchemy import text

router = APIRouter()

@router.get("/")
def get_checkouts(db: Session = Depends(get_db)):
    return db.execute(text("SELECT * FROM checkouts LIMIT 100")).fetchall()