# fastapi_app/routers/stock.py

from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from django.db import transaction, IntegrityError
from django.db.models import Q
from HMS_backend.models import Stock
from django.core.exceptions import ObjectDoesNotExist

router = APIRouter(prefix="/stock", tags=["Stock Management"])

# -------------------------------------------------
# 🧩 Pydantic Schemas
# -------------------------------------------------

class StockCreate(BaseModel):
    product_name: str
    category: str
    batch_number: str
    vendor: str
    quantity: int = Field(..., gt=0)
    vendor_id: str
    item_code: str
    rack_no: Optional[str] = None
    shelf_no: Optional[str] = None
    unit_price: float = Field(..., gt=0)
    status: Optional[str] = "available"


class StockUpdate(BaseModel):
    product_name: Optional[str] = None
    category: Optional[str] = None
    batch_number: Optional[str] = None
    vendor: Optional[str] = None
    add_quantity: Optional[int] = Field(0, ge=0)
    vendor_id: Optional[str] = None
    item_code: Optional[str] = None
    rack_no: Optional[str] = None
    shelf_no: Optional[str] = None
    unit_price: Optional[float] = None
    status: Optional[str] = None


class StockOut(BaseModel):
    id: int
    product_name: str
    category: str
    batch_number: str
    vendor: str
    quantity: int
    no_of_stocks: int
    vendor_id: str
    item_code: str
    rack_no: Optional[str]
    shelf_no: Optional[str]
    unit_price: float
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# -------------------------------------------------
# 🧾 CRUD Routes
# -------------------------------------------------

@router.post("/add", response_model=StockOut, status_code=status.HTTP_201_CREATED)
def add_stock(payload: StockCreate):
    """
    Add new stock item. 
    If stock already exists for the same batch/vendor, quantity is increased.
    """
    try:
        with transaction.atomic():
            stock, created = Stock.objects.get_or_create(
                product_name=payload.product_name.strip(),
                batch_number=payload.batch_number.strip(),
                vendor_id=payload.vendor_id.strip(),
                defaults={
                    "category": payload.category.strip(),
                    "vendor": payload.vendor.strip(),
                    "quantity": payload.quantity,
                    "status": payload.status,
                    "item_code": payload.item_code.strip(),
                    "rack_no": payload.rack_no.strip() if payload.rack_no else None,
                    "shelf_no": payload.shelf_no.strip() if payload.shelf_no else None,
                    "unit_price": payload.unit_price,
                }
            )
            if not created:
                stock.add_stock(payload.quantity)

            return StockOut(
                id=stock.id,
                product_name=stock.product_name,
                category=stock.category,
                batch_number=stock.batch_number,
                vendor=stock.vendor,
                quantity=stock.quantity,
                no_of_stocks=stock.no_of_stocks,
                vendor_id=stock.vendor_id,
                item_code=stock.item_code,
                rack_no=stock.rack_no,
                shelf_no=stock.shelf_no,
                unit_price=float(stock.unit_price),
                status=stock.status,
                created_at=stock.created_at,
                updated_at=stock.updated_at
            )
    except IntegrityError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Error adding stock: {str(e)}"
        )


@router.put("/edit/{stock_id}", response_model=StockOut)
def edit_stock(stock_id: int, payload: StockUpdate):
    """
    Update any field of a stock item and optionally add quantity.
    """
    try:
        stock = Stock.objects.get(id=stock_id)
    except Stock.DoesNotExist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stock item not found")

    # Update fields if provided
    if payload.product_name:
        stock.product_name = payload.product_name.strip()
    if payload.category:
        stock.category = payload.category.strip()
    if payload.batch_number:
        stock.batch_number = payload.batch_number.strip()
    if payload.vendor:
        stock.vendor = payload.vendor.strip()
    if payload.vendor_id:
        stock.vendor_id = payload.vendor_id.strip()
    if payload.item_code:
        stock.item_code = payload.item_code.strip()
    if payload.rack_no:
        stock.rack_no = payload.rack_no.strip()
    if payload.shelf_no:
        stock.shelf_no = payload.shelf_no.strip()
    if payload.unit_price is not None:
        stock.unit_price = payload.unit_price
    if payload.status:
        stock.status = payload.status.strip()

    # Add quantity if provided
    if payload.add_quantity and payload.add_quantity > 0:
        stock.add_stock(payload.add_quantity)
    else:
        stock.save()

    return StockOut(
        id=stock.id,
        product_name=stock.product_name,
        category=stock.category,
        batch_number=stock.batch_number,
        vendor=stock.vendor,
        quantity=stock.quantity,
        no_of_stocks=stock.no_of_stocks,
        vendor_id=stock.vendor_id,
        item_code=stock.item_code,
        rack_no=stock.rack_no,
        shelf_no=stock.shelf_no,
        unit_price=float(stock.unit_price),
        status=stock.status,
        created_at=stock.created_at,
        updated_at=stock.updated_at
    )


@router.get("/list", response_model=List[StockOut])
def list_stock():
    """
    List all stock items.
    """
    stocks = Stock.objects.all().order_by("id")
    return [
        StockOut(
            id=stock.id,
            product_name=stock.product_name,
            category=stock.category,
            batch_number=stock.batch_number,
            vendor=stock.vendor,
            quantity=stock.quantity,
            no_of_stocks=stock.no_of_stocks,
            vendor_id=stock.vendor_id,
            item_code=stock.item_code,
            rack_no=stock.rack_no,
            shelf_no=stock.shelf_no,
            unit_price=float(stock.unit_price),
            status=stock.status,
            created_at=stock.created_at,
            updated_at=stock.updated_at
        )
        for stock in stocks
    ]


# -------------------------------------------------
# 🔍 Search Route
# -------------------------------------------------

@router.get("/search", response_model=List[StockOut])
def search_stock(
    query: Optional[str] = Query(None, description="Search by product name, item code, rack no, or shelf no")
):
    """
    Search stock items by name, item_code, rack_no, or shelf_no.
    Case-insensitive partial match.
    """
    if not query:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Please provide a search query")

    stocks = Stock.objects.filter(
        Q(product_name__icontains=query) |
        Q(item_code__icontains=query) |
        Q(rack_no__icontains=query) |
        Q(shelf_no__icontains=query)
    ).order_by("id")

    if not stocks.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching stock found")

    return [
        StockOut(
            id=stock.id,
            product_name=stock.product_name,
            category=stock.category,
            batch_number=stock.batch_number,
            vendor=stock.vendor,
            quantity=stock.quantity,
            no_of_stocks=stock.no_of_stocks,
            vendor_id=stock.vendor_id,
            item_code=stock.item_code,
            rack_no=stock.rack_no,
            shelf_no=stock.shelf_no,
            unit_price=float(stock.unit_price),
            status=stock.status,
            created_at=stock.created_at,
            updated_at=stock.updated_at
        )
        for stock in stocks
    ]

@router.delete("/delete/{stock_id}", status_code=status.HTTP_200_OK)
def delete_stock(stock_id: int):
    """
    Delete a stock item by ID.
    """
    try:
        stock = Stock.objects.get(id=stock_id)
        stock.delete()
        
        return {
            "message": f"Stock item {stock_id} deleted successfully",
            "deleted_id": stock_id
        }
    except Stock.DoesNotExist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stock item with ID {stock_id} not found"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting stock: {str(e)}"
        )
