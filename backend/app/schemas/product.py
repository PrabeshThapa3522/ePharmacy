from datetime import datetime

from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    generic_name: str | None = Field(default=None, max_length=200)
    brand_name: str | None = Field(default=None, max_length=100)
    description: str | None = None
    category_id: int
    unit: str = Field(min_length=1, max_length=50)
    prescription_required: bool = False
    price: float = Field(gt=0)
    image_url: str | None = Field(default=None, max_length=500)

class ProductUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=200,
    )
    
    is_active: bool | None = None

    generic_name: str | None = Field(
        default=None,
        max_length=200,
    )

    brand_name: str | None = Field(
        default=None,
        max_length=100,
    )

    description: str | None = None

    category_id: int | None = None

    unit: str | None = Field(
        default=None,
        min_length=1,
        max_length=50,
    )

    prescription_required: bool | None = None

    price: float | None = Field(
        default=None,
        gt=0,
    )

    image_url: str | None = Field(
        default=None,
        max_length=500,
    )

class ProductResponse(BaseModel):
    id: int
    name: str
    generic_name: str | None
    brand_name: str | None
    description: str | None
    category_id: int
    unit: str
    prescription_required: bool
    price: float
    image_url: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True