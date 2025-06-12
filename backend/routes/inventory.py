from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from db import get_db
import requests
from utils.google_books import fetch_book_data
import logging

from pydantic import BaseModel

class BarcodeRequest(BaseModel):
    barcode: str

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/scan")
@router.post("/scan")
def scan_barcode(data: BarcodeRequest, db: Session = Depends(get_db)):
    barcode = data.barcode
    # Check if barcode exists in books
    result = db.execute(
        text("SELECT refid, title, author, subject FROM books WHERE barcode = :barcode"),
        {"barcode": barcode}
    )
    book = result.fetchone()

    # Log the scan
    db.execute(
        text("INSERT INTO scanned_inventory (barcode) VALUES (:barcode) ON CONFLICT DO NOTHING"),
        {"barcode": barcode}
    )

    if book:
        db.execute(
            text("""
                INSERT INTO current_inventory (barcode, refid)
                VALUES (:barcode, :refid)
                ON CONFLICT (barcode) DO NOTHING
            """),
            {"barcode": barcode, "refid": book.refid}
        )
        db.commit()
        return {
            "status": "found",
            "refid": book.refid,
            "title": book.title,
            "author": book.author,
            "subject": book.subject
        }
    else:
        db.execute(
            text("""
                INSERT INTO pending_books (barcode)
                VALUES (:barcode)
                ON CONFLICT (barcode) DO NOTHING
            """),
            {"barcode": barcode}
        )
        db.commit()
        return {"status": "not found", "next": "scan_isbn"}

@router.post("/isbn")
def attach_isbn(data: dict, db: Session = Depends(get_db)):
    barcode = data.get("barcode")
    isbn = data.get("isbn")

    if not barcode or not isbn:
        raise HTTPException(status_code=400, detail="Missing barcode or ISBN")

    logger.info(f"Looking up ISBN: {isbn}")
    book_info = fetch_book_data(isbn)
    logger.info(f"Book info received: {book_info}")

    if not book_info:
        raise HTTPException(status_code=404, detail="Book data not found")

    db.execute(
        text("""
            UPDATE pending_books
            SET isbn = :isbn,
                title = :title,
                author = :author,
                publisher = :publisher,
                subject = :subject,
                resolved = TRUE
            WHERE barcode = :barcode
        """),
        {
            "isbn": isbn,
            "title": book_info["title"],
            "author": book_info["author"],
            "publisher": book_info["publisher"],
            "subject": book_info["subject"],
            "barcode": barcode
        }
    )

    db.commit()

    return {
        "status": "attached",
        "barcode": barcode,
        "isbn": isbn,
        "title": book_info["title"]
    }

@router.post("/fetch")
def fetch_book_info(isbn: str, db: Session = Depends(get_db)):
    url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}"
    response = requests.get(url)
    data = response.json()

    if not data.get("items"):
        raise HTTPException(status_code=404, detail="Book not found in Google Books")

    volume = data["items"][0]["volumeInfo"]
    title = volume.get("title")
    author = ", ".join(volume.get("authors", []))
    subject = volume.get("categories", [])
    publisher = volume.get("publisher")

    db.execute(
        text("""
            UPDATE pending_books
            SET title = :title, author = :author, subject = :subject, publisher = :publisher
            WHERE isbn = :isbn
        """),
        {
            "title": title,
            "author": author,
            "subject": subject,
            "publisher": publisher,
            "isbn": isbn
        }
    )

    db.commit()

    return {
        "status": "fetched",
        "title": title,
        "author": author,
        "subject": subject,
        "publisher": publisher
    }
