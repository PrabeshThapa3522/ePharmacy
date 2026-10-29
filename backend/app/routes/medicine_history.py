
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
    staff_roles = {"staff", "pharmacist", "admin"}

    # Customers can only create records for themselves.
    if current_user.role not in staff_roles:
        if data.customer_id is not None and data.customer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only add records to your own history.",
            )
        customer_id = current_user.id
        record_type = "self_reported"

    else:
        # Staff may select a customer; default to the current user's ID
        # only if no customer ID was provided (which will fail validation).
        if data.customer_id is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please select a customer.",
            )

        customer = db.query(User).filter(
            User.id == data.customer_id
        ).first()

        if customer is None or customer.role != "customer":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer account not found.",
            )

        customer_id = customer.id

        if data.record_type not in {
            "self_reported",
            "pharmacy_supplied",
            "verified",
        }:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid medicine record type.",
            )

        if data.record_type == "verified" and current_user.role not in {
            "pharmacist",
            "admin",
        }:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only pharmacists or admins can verify medicine records.",
            )

        record_type = data.record_type

    # Validate a linked product, if supplied.
    if data.product_id is not None:
        product = db.query(Product).filter(
            Product.id == data.product_id,
            Product.is_active.is_(True),
        ).first()

        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Active product not found.",
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
        User.id == customer_id,
        User.role == "customer",
    ).first()

    if customer is None:
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


@router.get(
    "/customers",
    response_model=list[CustomerSearchResult],
)
def get_all_customers(
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db),
):
    return (
        db.query(User)
        .filter(User.role == "customer")
        .order_by(User.full_name.asc())
        .all()
    )
