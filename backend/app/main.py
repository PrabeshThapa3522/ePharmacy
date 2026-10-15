from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.models.user import User
from app.models.category import Category
from app.routes.categories import router as categories_router
from app.models.product import Product
from app.routes.products import router as products_router
from app.models.inventory import Inventory
from app.routes.inventory import router as inventory_router
from app.models.prescription import Prescription
from app.routes.prescriptions import router as prescriptions_router
from app.models.order import Order
from app.models.order_item import OrderItem
from app.routes.orders import router as orders_router
from app.routes.auth import router as auth_router
from app.routes.ai import router as ai_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Pharmacy API",
    description="Backend API for Pharmacy Management System",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(categories_router)
app.include_router(products_router)
app.include_router(inventory_router)
app.include_router(prescriptions_router)
app.include_router(orders_router)
app.include_router(ai_router)

@app.get("/")
def root():
    return {"message": "Pharmacy API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}