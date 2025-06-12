from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from db import get_db
import logging
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/")
def get_books(db: Session = Depends(get_db)):
    logger.info("get_books route was called")
    result = db.execute(text("SELECT * FROM books"))
    return [dict(row._mapping) for row in result]

