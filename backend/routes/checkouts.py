from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db

router = APIRouter()

@router.get("/")
def get_checkouts(db: Session = Depends(get_db)):
    return db.execute("SELECT * FROM checkouts LIMIT 100").fetchall()