from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_staff
from app.models.inventory import Inventory
from app.models.product import Product
from app.schemas.inventory import InventoryCreate, InventoryUpdate, InventoryResponse

router = APIRouter(
    prefix="/api/inventory",
    tags=["Inventory"],
)


@router.post(
    "/",
    response_model=InventoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_inventory(
    inventory_data: InventoryCreate,
    current_user = Depends(require_staff),
    db: Session = Depends(get_db),
):
    product = (
        db.query(Product)
        .filter(Product.id == inventory_data.product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    inventory = Inventory(
        product_id=inventory_data.product_id,
        batch_number=inventory_data.batch_number,
        quantity=inventory_data.quantity,
        reorder_level=inventory_data.reorder_level,
        purchase_price=inventory_data.purchase_price,
        selling_price=inventory_data.selling_price,
        manufacturing_date=inventory_data.manufacturing_date,
        expiry_date=inventory_data.expiry_date,
        supplier_name=inventory_data.supplier_name,
    )

    db.add(inventory)
    db.commit()
    db.refresh(inventory)

    return inventory


@router.get(
    "/",
    response_model=list[InventoryResponse],
)
def get_inventory(
    db: Session = Depends(get_db),
):
    return db.query(Inventory).all()

@router.patch(
    "/{inventory_id}",
    response_model=InventoryResponse,
)
def update_inventory(
    inventory_id: int,
    inventory_data: InventoryUpdate,
    current_user = Depends(require_staff),
    db: Session = Depends(get_db),
):
    inventory = (
        db.query(Inventory)
        .filter(Inventory.id == inventory_id)
        .first()
    )

    if not inventory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory record not found",
        )

    update_data = inventory_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(inventory, field, value)

    db.commit()
    db.refresh(inventory)

    return inventory

@router.get(
    "/low-stock",
    response_model=list[InventoryResponse],
)
def get_low_stock(
    db: Session = Depends(get_db),
):
    return (
        db.query(Inventory)
        .filter(Inventory.quantity <= Inventory.reorder_level)
        .all()
    )
    
@router.get(
    "/expired",
    response_model=list[InventoryResponse],
)
def get_expired_inventory(
    db: Session = Depends(get_db),
):
    today = date.today()

    return (
        db.query(Inventory)
        .filter(Inventory.expiry_date < today)
        .all()
    )

@router.get(
    "/expiring-soon",
    response_model=list[InventoryResponse],
)
def get_expiring_soon(
    db: Session = Depends(get_db),
):
    today = date.today()
    expiry_limit = today + timedelta(days=30)

    return (
        db.query(Inventory)
        .filter(
            Inventory.expiry_date >= today,
            Inventory.expiry_date <= expiry_limit,
        )
        .all()
    )