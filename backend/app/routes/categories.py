from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_staff
from app.models.category import Category


router = APIRouter(
    prefix="/api/categories",
    tags=["Categories"],
)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_category(
    name: str,
    description: str | None = None,
    current_user = Depends(require_staff),
    db: Session = Depends(get_db),
):
    existing_category = (
        db.query(Category)
        .filter(Category.name == name)
        .first()
    )

    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category already exists",
        )

    category = Category(
        name=name,
        description=description,
    )

    db.add(category)
    db.commit()
    db.refresh(category)

    return category


@router.get("/")
def get_categories(
    db: Session = Depends(get_db),
):
    return db.query(Category).all()