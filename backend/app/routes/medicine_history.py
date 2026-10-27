
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.schemas.medicine_history import CustomerSearchResult
from app.schemas.medicine_history import MedicineSearchResult

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_staff
from app.models.medicine_history import MedicineHistory
from app.models.product import Product
from app.models.user import User
from app.schemas.medicine_history import (
    MedicineHistoryCreate,
    MedicineHistoryResponse,
)

router = APIRouter(
    prefix="/api/medicine-history",
    tags=["Medicine History"],
)


@router.post(
    "/",
    response_model=MedicineHistoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_medicine_history(
    data: MedicineHistoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Customers can only add records to their own history.
    # Staff can add records for a selected customer.
    customer_id = current_user.id

    if current_user.role in {"staff", "pharmacist", "admin"}:
        if data.customer_id is not None:
            customer_id = data.customer_id

            customer = db.query(User).filter(
                User.id == customer_id
            ).first()

            if not customer:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Customer not found.",
                )
    elif data.customer_id is not None and data.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only add records to your own history.",
        )

    # Do not allow customers to mark their own records as verified.
    if current_user.role not in {"staff", "pharmacist", "admin"}:
        record_type = "self_reported"
    else:
        record_type = data.record_type

    if record_type not in {
        "self_reported",
        "pharmacy_supplied",
        "verified",
    }:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid medicine record type.",
        )

    # Validate a linked product, if supplied.
    if data.product_id is not None:
        product = db.query(Product).filter(
            Product.id == data.product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Selected product not found.",
            )

    medicine_name = data.medicine_name.strip()

    if not medicine_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Medicine name cannot be empty.",
        )

    record = MedicineHistory(
        customer_id=customer_id,
        product_id=data.product_id,
        medicine_name=medicine_name,
        strength=data.strength,
        quantity=data.quantity,
        record_type=record_type,
        recorded_by=current_user.id,
        recorded_date=data.recorded_date,
        notes=data.notes,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


@router.get(
    "/my",
    response_model=list[MedicineHistoryResponse],
)
def get_my_medicine_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(MedicineHistory)
        .filter(MedicineHistory.customer_id == current_user.id)
        .order_by(MedicineHistory.created_at.desc())
        .all()
    )


@router.get(
    "/customer/{customer_id}",
    response_model=list[MedicineHistoryResponse],
)
def get_customer_medicine_history(
    customer_id: int,
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db),
):
    customer = db.query(User).filter(
        User.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found.",
        )

    return (
        db.query(MedicineHistory)
        .filter(MedicineHistory.customer_id == customer_id)
        .order_by(MedicineHistory.created_at.desc())
        .all()
    )


@router.get(
    "/customers/search",
    response_model=list[CustomerSearchResult],
)
def search_customers(
    q: str,
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db),
):
    query = q.strip()

    if len(query) < 2:
        return []

    return (
        db.query(User)
        .filter(
            User.role == "customer",
            or_(
                User.full_name.ilike(f"%{query}%"),
                User.email.ilike(f"%{query}%"),
            ),
        )
        .order_by(User.full_name)
        .limit(10)
        .all()
    )
    
    

@router.get(
    "/medicines/search",
    response_model=list[MedicineSearchResult],
)
def search_medicines(
    q: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = q.strip()

    if len(query) < 2:
        return []

    return (
        db.query(Product)
        .filter(
            Product.is_active.is_(True),
            or_(
                Product.name.ilike(f"%{query}%"),
                Product.generic_name.ilike(f"%{query}%"),
                Product.brand_name.ilike(f"%{query}%"),
            ),
        )
        .order_by(Product.name)
        .limit(10)
        .all()
    )

