from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import books, checkouts, inventory, students, reports
from dotenv import load_dotenv

load_dotenv()




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books.router, prefix="/api/books")
app.include_router(checkouts.router, prefix="/api/checkouts")
app.include_router(inventory.router, prefix="/api/inventory")
app.include_router(students.router, prefix="/api/students")
app.include_router(reports.router, prefix="/api/reports")
