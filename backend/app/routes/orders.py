from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.prescription import Prescription

from app.core.database import get_db
from app.core.dependencies import (
    get_current_user,
    require_staff,
)
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.inventory import Inventory
from app.models.user import User
from app.schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderDetailResponse,
    OrderStatusUpdate,
    PaymentStatusUpdate,
)

VALID_ORDER_TRANSITIONS = {
    "pending": ["confirmed", "cancelled"],
    "confirmed": ["processing", "cancelled"],
    "processing": ["shipped", "cancelled"],
    "shipped": ["delivered"],
    "delivered": [],
    "cancelled": [],
}

router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"],
)


@router.post(
    "/",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item",
        )

    total_amount = 0
    order_items = []

    for item in order_data.items:
        product = (
            db.query(Product)
            .filter(
                Product.id == item.product_id,
                Product.is_active == True,)
            .first()
        )

        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product {item.product_id} not found",
            )
            
            
        if product.prescription_required:
            if not order_data.prescription_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        f"Prescription ID required "
                        f"for product {item.product_id}"
                    ),
                )

            prescription = (
                db.query(Prescription)
                .filter(
                    Prescription.id == order_data.prescription_id,
                    Prescription.user_id == current_user.id,
                    Prescription.status == "approved",
                )
                .first()
            )

            if not prescription:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid or unapproved prescription",
                )
                
        else:
            if order_data.prescription_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Prescription is not required for product {item.product_id}"
        )

        inventory = (
            db.query(Inventory)
            .filter(
                Inventory.product_id == item.product_id,
                Inventory.quantity >= item.quantity,
                Inventory.expiry_date > date.today(),
            )
            .first()
        )

        if not inventory:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for product {item.product_id}",
            )

        inventory.quantity -= item.quantity

        unit_price = float(product.price)
        subtotal = unit_price * item.quantity

        total_amount += subtotal

        order_items.append(
            {
                "product_id": product.id,
                "quantity": item.quantity,
                "unit_price": unit_price,
                "subtotal": subtotal,
            }
        )

    order = Order(
        user_id=current_user.id,
        prescription_id=order_data.prescription_id,
        total_amount=total_amount,
        shipping_address=order_data.shipping_address,
    )

    db.add(order)
    db.flush()

    for item in order_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item["product_id"],
            quantity=item["quantity"],
            unit_price=item["unit_price"],
            subtotal=item["subtotal"],
        )

        db.add(order_item)

    db.commit()
    db.refresh(order)

    return order

@router.get(
    "/my",
    response_model=list[OrderDetailResponse],
)
def get_my_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    


@router.get(
    "/all",
    response_model=list[OrderDetailResponse],
)
def get_all_orders(
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db),
):
    return (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .all()
    )
    
@router.patch(
    "/{order_id}/status",
    response_model=OrderDetailResponse,
)
def update_order_status(
    order_id: int,
    status_data: OrderStatusUpdate,
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    allowed_statuses = VALID_ORDER_TRANSITIONS.get(
        order.status,
        [],
    )

    if status_data.status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Cannot change order status from "
                f"'{order.status}' to "
                f"'{status_data.status}'"
            ),
        )

    order.status = status_data.status

    db.commit()
    db.refresh(order)
    db.commit()
    db.refresh(order)

    return order

@router.patch(
    "/{order_id}/payment-status",
    response_model=OrderDetailResponse,
)
def update_payment_status(
    order_id: int,
    payment_data: PaymentStatusUpdate,
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    order.payment_status = payment_data.payment_status

    db.commit()
    db.refresh(order)

    return order
    
@router.get(
    "/{order_id}",
    response_model=OrderDetailResponse,
)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order = (
        db.query(Order)
        .filter(
            Order.id == order_id,
            Order.user_id == current_user.id,
        )
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    return order
