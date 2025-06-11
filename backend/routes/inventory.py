from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
import requests

router = APIRouter()

@router.post("/scan")
def scan_barcode(barcode: str, db: Session = Depends(get_db)):
    # Check if barcode exists in books
    result = db.execute("SELECT refid, title, author, subject FROM books WHERE barcode = %s", (barcode,))
    book = result.fetchone()

    # Log the scan in scanned_inventory (optional but useful)
    db.execute("INSERT INTO scanned_inventory (barcode) VALUES (%s) ON CONFLICT DO NOTHING", (barcode,))

    if book:
        # Add to current_inventory
        db.execute("""
            INSERT INTO current_inventory (barcode, refid)
            VALUES (%s, %s)
            ON CONFLICT (barcode) DO NOTHING
        """, (barcode, book.refid))
        db.commit()
        return {
            "status": "found",
            "refid": book.refid,
            "title": book.title,
            "author": book.author,
            "subject": book.subject
        }
    else:
        # Add to pending_books
        db.execute("""
            INSERT INTO pending_books (barcode)
            VALUES (%s)
            ON CONFLICT (barcode) DO NOTHING
        """, (barcode,))
        db.commit()
        return {"status": "not found", "next": "scan_isbn"}


@router.post("/isbn")
def attach_isbn(barcode: str, isbn: str, db: Session = Depends(get_db)):
    # Call Google Books API
    url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}"
    res = requests.get(url)
    data = res.json()

    if not data.get("items"):
        raise HTTPException(status_code=404, detail="ISBN not found in Google Books API")

    info = data["items"][0]["volumeInfo"]
    title = info.get("title")
    author = ", ".join(info.get("authors", []))
    subject = info.get("categories", [])
    publisher = info.get("publisher")

    # Update pending_books with info
    db.execute("""
        UPDATE pending_books
        SET isbn = %s,
            title = %s,
            author = %s,
            subject = %s,
            publisher = %s,
            resolved = TRUE
        WHERE barcode = %s
    """, (isbn, title, author, subject, publisher, barcode))

    db.commit()

    return {
        "status": "attached",
        "title": title,
        "author": author,
        "subject": subject,
        "publisher": publisher
    }


@router.post("/fetch")
def fetch_book_info(isbn: str, db: Session = Depends(get_db)):
    # Query Google Books API
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

    # Update the pending_books table
    db.execute("""
        UPDATE pending_books
        SET title = %s, author = %s, subject = %s, publisher = %s
        WHERE isbn = %s
    """, (title, author, subject, publisher, isbn))
    db.commit()

    return {
        "status": "fetched",
        "title": title,
        "author": author,
        "subject": subject,
        "publisher": publisher
    }
