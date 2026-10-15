from datetime import date, datetime

from pydantic import BaseModel, Field, field_validator


class InventoryCreate(BaseModel):
    product_id: int
    batch_number: str = Field(min_length=1, max_length=100)
    quantity: int = Field(ge=0)
    reorder_level: int = Field(ge=0)
    purchase_price: float = Field(gt=0)
    selling_price: float = Field(gt=0)
    manufacturing_date: date | None = None
    expiry_date: date
    supplier_name: str | None = Field(default=None, max_length=200)
    
    @field_validator("expiry_date")
    @classmethod
    def validate_expiry_date(cls, value):
        if value <= date.today():
            raise ValueError("Expiry date must be in the future")
        return value

class InventoryUpdate(BaseModel):
    batch_number: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    quantity: int | None = Field(
        default=None,
        ge=0,
    )

    reorder_level: int | None = Field(
        default=None,
        ge=0,
    )

    purchase_price: float | None = Field(
        default=None,
        gt=0,
    )

    selling_price: float | None = Field(
        default=None,
        gt=0,
    )

    manufacturing_date: date | None = None

    expiry_date: date | None = None

    supplier_name: str | None = Field(
        default=None,
        max_length=200,
    )
    
    @field_validator("expiry_date")
    @classmethod
    def validate_expiry_date(cls, value):
        if value <= date.today():
            raise ValueError("Expiry date must be in the future")
        return value

class InventoryResponse(BaseModel):
    id: int
    product_id: int
    batch_number: str
    quantity: int
    reorder_level: int
    purchase_price: float
    selling_price: float
    manufacturing_date: date | None
    expiry_date: date
    supplier_name: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True