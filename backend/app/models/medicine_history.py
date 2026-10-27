
from datetime import date, datetime

from sqlalchemy import (
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class MedicineHistory(Base):
    __tablename__ = "medicine_history"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # Customer whose medicine history this belongs to
    customer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    # Product selected from the pharmacy catalogue.
    # NULL means the medicine was entered manually.
    product_id: Mapped[int | None] = mapped_column(
        ForeignKey("products.id"),
        nullable=True,
        index=True,
    )

    # Medicine name is saved as a snapshot so the history
    # remains readable even if the catalogue changes.
    medicine_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    strength: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    quantity: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    # self_reported, pharmacy_supplied, or verified
    record_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="self_reported",
    )

    # User who created the record (customer or staff)
    recorded_by: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    # When the medicine was reportedly taken or supplied,
    # if known
    recorded_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
