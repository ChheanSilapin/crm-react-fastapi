from typing import Optional
from datetime import date, datetime
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.common import ErrorResponse, ListResponse, SuccessResponse
from app.core.dependencies import require_permissions

from app.modules.customer.schema import (
    CustomerCreate, CustomerUpdate, CustomerResponse, CustomerDeletionResponse, DateFilter
)
from app.modules.customer.service import CustomerService

router = APIRouter()

@router.post("/customers", response_model=SuccessResponse[CustomerResponse], status_code=status.HTTP_201_CREATED, responses={
    409: {"model": ErrorResponse, "description": "Conflict: Customer ID already exists"}
})
def create_customer(
    payload: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permissions(["customers:create"]))
):
    new_customer = CustomerService.create_customer(db, payload, current_user)
    return SuccessResponse(
        message="Customer created successfully",
        data=CustomerResponse.model_validate(new_customer)
    )

@router.get("/customers", response_model=ListResponse[CustomerResponse])
def list_customers(
    page: int = Query(1, ge=1, description="Page number for pagination (starts at 1)"),
    limit: Optional[int] = Query(
        None,
        gt=0,
        le=200,
        description="Number of items per page. If omitted and all_customers=true, return all records"
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permissions(["customers:read"])),
    date_filter: Optional[DateFilter] = Query(DateFilter.TODAY, description="Date filter shortcut"),
    start_date: Optional[datetime] = Query(None, description="Custom start date"),
    end_date: Optional[datetime] = Query(None, description="Custom end date"),
    currency: Optional[str] = Query(None, description="Filter by currency (e.g., USD, KHR)"),
    txn_type: Optional[str] = Query(None, alias="type", description="Filter by transaction type (Deposit, Withdrawal)")
):
    """
    Retrieve a paginated list of customers.
    """
    result = CustomerService.list_customers(
        db=db, page=page, limit=limit, date_filter=date_filter,
        start_date=start_date, end_date=end_date,
        currency=currency, txn_type=txn_type
    )

    return ListResponse[CustomerResponse](
        items=[CustomerResponse.model_validate(item) for item in result["items"]],
        total=result["total"],
        limit=result["limit"],
        offset=result["offset"],
        message=result["message"],
        page=result["page"],
        pages=result["pages"],
        has_next=result["has_next"],
        has_prev=result["has_prev"]
    )
    
@router.get("/customers/{id}", response_model=SuccessResponse[CustomerResponse], responses={
    404: {"model": ErrorResponse, "description": "Not Found: Customer not found"}
})
def get_customer(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permissions(["customers:read"]))
):
    """
    Get a single customer by their unique integer ID.
    """
    customer = CustomerService.get_customer(db, id)
    return SuccessResponse(
        message="Customer retrieved successfully",
        data=CustomerResponse.model_validate(customer)
    )

@router.put("/customers/{id}", response_model=SuccessResponse[CustomerResponse], responses={
    404: {"model": ErrorResponse, "description": "Not Found: Customer not found"}
})
def update_customer(
    id: int,
    payload: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permissions(["customers:update"]))
):
    """
    Update an existing customer's information.
    """
    updated_customer = CustomerService.update_customer(db, id, payload)
    return SuccessResponse(
        message=f"Customer with ID {id} updated successfully",
        data=CustomerResponse.model_validate(updated_customer)
    )
        
@router.delete("/customers/{id}", response_model=CustomerDeletionResponse, responses={
    404: {"model": ErrorResponse, "description": "Not Found: Customer not found"}
})
def delete_customer(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permissions(["customers:delete"]))
):
    """
    Delete a customer entry by ID and return a detailed deletion response.
    """
    response_data = CustomerService.delete_customer(db, id)
    return CustomerDeletionResponse(
        message="Customer deleted successfully",
        **response_data
    )