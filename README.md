📚 Library Dashboard

A school library dashboard to manage book inventory, checkouts, and student data — built with React, FastAPI, and PostgreSQL.

🚀 Features

🔎 Searchable book list (by title, author, subject)
🧾 Checkout tracking with overdue highlighting
🧒 Student lookup and record integration
📦 Inventory scanning and live reconciliation
📚 Integration with Google Books API for new titles
📊 Admin dashboard (WIP)
🧱 Tech Stack

Frontend	Backend	Database	Infra
React (CRA)	FastAPI	PostgreSQL	Docker Compose
Axios	SQLAlchemy		
🐳 Getting Started

1. Clone the repo
git clone git@github.com:donbatson123/library-dashboard.git
cd library-dashboard
2. Start the stack
docker-compose up --build
Frontend: http://localhost:3000
Backend API: http://localhost:8001
3. Run inventory test (optional)
curl -X POST http://localhost:8001/api/inventory/isbn \
  -H "Content-Type: application/json" \
  -d '{"barcode": "TEST123", "isbn": "9780140328721"}'
🗂 Project Structure

library-dashboard/
├── backend/
│   ├── routes/
│   ├── db.py
│   ├── main.py
│   └── Dockerfile
├── frontend/
│   ├── src/components/
│   ├── public/
│   └── Dockerfile
├── init/
│   └── inventory.sql
├── docker-compose.yml
└── README.md
✅ TODO

 Authentication & roles
 Add/edit/delete books UI
 Full inventory reporting
 Auto-reconciliation for unmatched barcodes
💬 Acknowledgements

Thanks to all the students, educators, and libraries that inspired this tool.

© Don Batson, 2025

