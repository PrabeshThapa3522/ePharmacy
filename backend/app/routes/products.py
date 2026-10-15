from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_staff
from app.models.category import Category
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse


router = APIRouter(
    prefix="/api/products",
    tags=["Products"],
)


@router.post(
    "/",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_product(
    product_data: ProductCreate,
    current_user = Depends(require_staff),
    db: Session = Depends(get_db),
):
    category = (
        db.query(Category)
        .filter(Category.id == product_data.category_id)
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    product = Product(
        name=product_data.name,
        generic_name=product_data.generic_name,
        brand_name=product_data.brand_name,
        description=product_data.description,
        category_id=product_data.category_id,
        unit=product_data.unit,
        prescription_required=product_data.prescription_required,
        price=product_data.price,
        image_url=product_data.image_url,
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


@router.get(
    "/",
    response_model=list[ProductResponse],
)
def get_products(
    db: Session = Depends(get_db),
):
    return (
        db.query(Product)
        .filter(Product.is_active == True)
        .all()
    )


@router.patch(
    "/{product_id}",
    response_model=ProductResponse,
)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    current_user = Depends(require_staff),
    db: Session = Depends(get_db),
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    update_data = product_data.model_dump(
        exclude_unset=True
    )

    if "category_id" in update_data:
        category = (
            db.query(Category)
            .filter(
                Category.id == update_data["category_id"]
            )
            .first()
        )

        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )

    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)

    return product