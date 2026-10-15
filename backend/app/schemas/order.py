from datetime import datetime

from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    items: list[OrderItemCreate]
    shipping_address: str | None = None
    prescription_id: int | None = None


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    subtotal: float
    created_at: datetime

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    user_id: int
    status: str
    total_amount: float
    shipping_address: str | None
    payment_status: str
    prescription_id: int | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        

class OrderDetailResponse(BaseModel):
    id: int
    user_id: int
    status: str
    total_amount: float
    shipping_address: str | None
    payment_status: str
    prescription_id: int | None
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemResponse]

    class Config:
        from_attributes = True
        
class OrderStatusUpdate(BaseModel):
    status: str = Field(
        pattern="^(pending|confirmed|processing|shipped|delivered|cancelled)$"
    )
    
class PaymentStatusUpdate(BaseModel):
    payment_status: str = Field(
        pattern="^(pending|paid|failed)$"
    )