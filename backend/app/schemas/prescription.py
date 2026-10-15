from datetime import datetime

from pydantic import BaseModel, Field


class PrescriptionCreate(BaseModel):
    image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    notes: str | None = None


class PrescriptionReview(BaseModel):
    status: str = Field(
        pattern="^(approved|rejected)$"
    )

    notes: str | None = None

class PrescriptionResponse(BaseModel):
    id: int
    user_id: int
    customer_name: str
    image_url: str | None
    status: str
    notes: str | None
    reviewed_by: int | None
    reviewed_at: datetime | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        
        
        