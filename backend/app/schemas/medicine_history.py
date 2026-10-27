
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class MedicineHistoryCreate(BaseModel):
    customer_id: int | None = None
    product_id: int | None = None

    medicine_name: str = Field(min_length=1, max_length=200)
    strength: str | None = Field(default=None, max_length=100)
    quantity: int | None = Field(default=None, ge=1)

    record_type: str = "self_reported"
    recorded_date: date | None = None
    notes: str | None = None


class MedicineHistoryResponse(BaseModel):
    id: int
    customer_id: int
    product_id: int | None
    medicine_name: str
    strength: str | None
    quantity: int | None
    record_type: str
    recorded_by: int
    recorded_date: date | None
    notes: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)



class CustomerSearchResult(BaseModel):
    id: int
    full_name: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class MedicineSearchResult(BaseModel):
    id: int
    name: str
    generic_name: str | None
    brand_name: str | None
    unit: str
    prescription_required: bool

    model_config = ConfigDict(from_attributes=True)
