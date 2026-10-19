
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_pharmacist, require_staff
from app.models.prescription import Prescription
from app.models.user import User
from app.schemas.prescription import (
    PrescriptionCreate,
    PrescriptionReview,
    PrescriptionResponse,
)


router = APIRouter(
    prefix="/api/prescriptions",
    tags=["Prescriptions"],
)


@router.post(
    "/",
    response_model=PrescriptionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_prescription(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    allowed_types = {
        "image/jpeg",
        "image/png",
        "application/pdf",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, PNG, and PDF files are allowed.",
        )

    file_extension = file.filename.split(".")[-1].lower()

    upload_directory = Path("uploads/prescriptions")
    upload_directory.mkdir(parents=True, exist_ok=True)

    file_path = upload_directory / (
        f"{current_user.id}_{datetime.utcnow().timestamp()}.{file_extension}"
    )

    with open(file_path, "wb") as uploaded_file:
        uploaded_file.write(file.file.read())

    prescription = Prescription(
        user_id=current_user.id,
        image_url=str(file_path),
    )

    db.add(prescription)
    db.commit()
    db.refresh(prescription)

    return prescription


@router.get(
    "/my",
    response_model=list[PrescriptionResponse],
)
def get_my_prescriptions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prescriptions = (
        db.query(Prescription)
        .filter(Prescription.user_id == current_user.id)
        .all()
    )

    return [
        {
            "id": prescription.id,
            "user_id": prescription.user_id,
            "customer_name": prescription.user.full_name,
            "image_url": prescription.image_url,
            "status": prescription.status,
            "notes": prescription.notes,
            "reviewed_by": prescription.reviewed_by,
            "reviewed_at": prescription.reviewed_at,
            "created_at": prescription.created_at,
            "updated_at": prescription.updated_at,
        }
        for prescription in prescriptions
    ]


@router.get(
    "/",
    response_model=list[PrescriptionResponse],
)
def get_all_prescriptions(
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db),
):
    prescriptions = (
        db.query(Prescription)
        .order_by(Prescription.created_at.desc())
        .all()
    )

    return [
        {
            "id": prescription.id,
            "user_id": prescription.user_id,
            "customer_name": prescription.user.full_name,
            "image_url": prescription.image_url,
            "status": prescription.status,
            "notes": prescription.notes,
            "reviewed_by": prescription.reviewed_by,
            "reviewed_at": prescription.reviewed_at,
            "created_at": prescription.created_at,
            "updated_at": prescription.updated_at,
        }
        for prescription in prescriptions
    ]


@router.get("/{prescription_id}/file")
def view_prescription_file(
    prescription_id: int,
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db),
):
    prescription = (
        db.query(Prescription)
        .filter(Prescription.id == prescription_id)
        .first()
    )

    if not prescription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prescription not found.",
        )

    if not prescription.image_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prescription file not found.",
        )

    file_path = Path(prescription.image_url).resolve()

    if not file_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prescription file is missing from the server.",
        )

    return FileResponse(
        path=file_path,
        media_type=(
            "application/pdf"
            if file_path.suffix.lower() == ".pdf"
            else "image/jpeg"
            if file_path.suffix.lower() in {".jpg", ".jpeg"}
            else "image/png"
        ),
        filename=file_path.name,
        content_disposition_type="inline",
    )

@router.patch(
    "/{prescription_id}/review",
    response_model=PrescriptionResponse,
)
def review_prescription(
    prescription_id: int,
    review_data: PrescriptionReview,
    current_user: User = Depends(require_pharmacist),
    db: Session = Depends(get_db),
):
    prescription = (
        db.query(Prescription)
        .filter(Prescription.id == prescription_id)
        .first()
    )

    if not prescription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prescription not found",
        )

    if prescription.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prescription has already been reviewed",
        )

    prescription.status = review_data.status
    prescription.notes = review_data.notes
    prescription.reviewed_by = current_user.id
    prescription.reviewed_at = datetime.utcnow()

    db.commit()
    db.refresh(prescription)

    return prescription