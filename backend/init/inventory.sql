-- File: backend/init/inventory.sql

-- Table to track scanned books that are part of current inventory
CREATE TABLE IF NOT EXISTS current_inventory (
    id SERIAL PRIMARY KEY,
    barcode VARCHAR(50) UNIQUE NOT NULL,
    refid VARCHAR(50) REFERENCES books(refid),
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to store books we scanned but couldn't match to known inventory
CREATE TABLE IF NOT EXISTS pending_books (
    id SERIAL PRIMARY KEY,
    barcode VARCHAR(50) UNIQUE NOT NULL,
    isbn VARCHAR(20),
    title TEXT,
    author TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE
);

-- Table: scanned_inventory
CREATE TABLE IF NOT EXISTS scanned_inventory (
    id SERIAL PRIMARY KEY,
    barcode TEXT NOT NULL,
    scan_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE pending_books
ADD COLUMN subject TEXT[],
ADD COLUMN publisher TEXT;