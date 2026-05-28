"""
API endpoints for managing customer data.
"""
from typing import List, Optional
from datetime import date, time as dtime, datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError, DBAPIError
from sqlalchemy import func, and_

from app.database import get_db
from app.models.customers import Customer
from app.models.user import User
from app.models.banks import Bank
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse, CustomerDeletionResponse
from app.schemas.common import ErrorResponse, ListResponse, SuccessResponse
from app.api.deps import get_db, check_permissions, get_current_user

# Define a shared responses dictionary for common HTTP errors
common_responses = {
    401: {"model": ErrorResponse, "description": "Unauthorized: Not authenticated"},
    403: {"model": ErrorResponse, "description": "Forbidden: Insufficient permissions"},
    404: {"model": ErrorResponse, "description": "Resource not found"}
}

# Create the APIRouter and apply the common responses
router = APIRouter(tags=["customers"], responses=common_responses)

@router.post("/customers", response_model=SuccessResponse[CustomerResponse], status_code=status.HTTP_201_CREATED, responses={
    409: {"model": ErrorResponse, "description": "Conflict: Customer ID already exists"}
})
def create_customer(
    payload: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permissions(["customers:create"]))
):
    bank = db.query(Bank).filter(Bank.bank_id == payload.bank_id).first()
    if not bank:
        raise HTTPException(status_code=404, detail=f"Bank with id {payload.bank_id} not found")

    existing_customer = db.query(Customer).filter(Customer.customer_id == payload.customer_id).first()
    if existing_customer:
        raise HTTPException(status_code=409, detail=f"Customer with id {payload.customer_id} already exists")

    new_customer = Customer(
        **payload.model_dump(),
        create_by_user=current_user.id,
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return {
        "message": "Customer created successfully",
        "data": new_customer
    }

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
    current_user: User = Depends(check_permissions(["customers:read"])),
    create_at: Optional[date] = Query(None, description="Filter by specific creation date (YYYY-MM-DD)"),
    today: bool = Query(True, description="Show only customers created today (default: true)"),
    all_customers: bool = Query(False, description="Show all customers, ignoring date filters"),
    start_time: Optional[dtime] = Query(None, description="Start time (HH:MM or HH:MM:SS) for the selected date"),
    end_time: Optional[dtime] = Query(None, description="End time (HH:MM or HH:MM:SS) for the selected date"),
    currency: Optional[str] = Query(None, description="Filter by currency (e.g., USD, KHR)"),
    txn_type: Optional[str] = Query(None, alias="type", description="Filter by transaction type (Deposit, Withdrawal)")
):
    """
    Retrieve a paginated list of customers. By default, shows customers created today.
    Use create_at for a specific date or all_customers=true for all customers.
    """
    
    # Calculate offset based on page and limit (if paginating)
    offset = (page - 1) * (limit or 0)
    
    query = db.query(Customer)
    filter_date = None

    if all_customers:
        message = "Show all customers"
    elif create_at:
        filter_date = create_at
        message = f"Show customers created on {create_at}"
    else:
        filter_date = date.today()
        message = f"Show customers created today ({filter_date})"

    # Apply date filter (by date only) first
    if filter_date and not all_customers:
        query = query.filter(func.date(Customer.create_at) == filter_date)

    # Apply time-of-day filtering when provided
    if (start_time is not None) or (end_time is not None):
        # If a specific date is selected (and not all_customers), use absolute datetimes on that date
        if filter_date and not all_customers:
            start_dt = datetime.combine(filter_date, start_time or dtime(0, 0, 0))
            end_dt = datetime.combine(filter_date, end_time or dtime(23, 59, 59))
            if end_dt < start_dt:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid time range: end_time must be greater than or equal to start_time"
                )
            query = query.filter(and_(Customer.create_at >= start_dt, Customer.create_at <= end_dt))
        else:
            # all_customers=true (or no specific date): compare only the time component across all dates
            start_t = start_time or dtime(0, 0, 0)
            end_t = end_time or dtime(23, 59, 59)
            if end_t < start_t:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid time range: end_time must be greater than or equal to start_time"
                )
            start_str = start_t.strftime("%H:%M:%S")
            end_str = end_t.strftime("%H:%M:%S")
            query = query.filter(and_(func.time(Customer.create_at) >= start_str, func.time(Customer.create_at) <= end_str))
        message += f" between {start_time or '00:00'} and {end_time or '23:59'}"

    # Apply optional currency filter
    if currency:
        query = query.filter(Customer.currency == currency.upper())

    # Apply optional transaction type filter
    if txn_type:
        # Case-insensitive match for transaction type (e.g., Deposit, Withdrawal)
        t = txn_type.strip()
        t_lower = t.lower()
        # Normalize synonyms
        if t_lower in ("withdraw", "withdrawal"):
            t_lower = "withdrawal"
        query = query.filter(func.lower(Customer.type) == t_lower)

    # Calculate total count of filtered records before applying limit and offset
    total_count = query.count()
    
    # Handle the case where no customers are found to prevent ValidationError
    if total_count == 0:
        pages = 1
        has_next = False
        has_prev = False
        items = []
        message += " (no customers found)"
    else:
        if limit is None and all_customers:
            # Return all rows (no pagination) when explicitly asking for all customers
            items = (
                query
                .order_by(Customer.id.desc())
                .options(
                    joinedload(Customer.created_by_user),
                    joinedload(Customer.bank, innerjoin=False)
                )
                .all()
            )
            pages = 1
            has_next = False
            has_prev = False
            offset = 0
            limit_for_response = total_count
        else:
            # Paginated response
            limit_for_response = limit or 10
            pages = (total_count + limit_for_response - 1) // limit_for_response
            has_next = offset + limit_for_response < total_count
            has_prev = offset > 0
            
            items = (
                query
                .order_by(Customer.id.desc())
                .limit(limit_for_response)
                .offset(offset)
                .options(
                    joinedload(Customer.created_by_user),
                    joinedload(Customer.bank, innerjoin=False)
                )
                .all()
            )

    return ListResponse[CustomerResponse](
        items=items,
        total=total_count,
        limit=(limit_for_response if 'limit_for_response' in locals() else limit or 10),
        offset=offset,
        message=message,
        page=page,
        pages=pages,
        has_next=has_next,
        has_prev=has_prev
    )
    
@router.get("/customers/{id}", response_model=SuccessResponse[CustomerResponse], responses={
    404: {"model": ErrorResponse, "description": "Not Found: Customer not found"}
})
def get_customer(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permissions(["customers:read"]))
):
    """
    Get a single customer by their unique integer ID.
    """
    customer = (
        db.query(Customer)
        .options(joinedload(Customer.created_by_user))
        .filter(Customer.id == id)
        .first()
    )
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    
    return SuccessResponse(
        message="Customer retrieved successfully",
        data=customer
    )

@router.put("/customers/{id}", response_model=SuccessResponse[CustomerResponse], responses={
    404: {"model": ErrorResponse, "description": "Not Found: Customer not found"}
})
def update_customer(
    id: int,
    payload: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permissions(["customers:update"]))
):
    """
    Update an existing customer's information.
    """
    customer = db.query(Customer).filter(Customer.id == id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(customer, key, value)

    try:
        db.commit()
        db.refresh(customer)
        
        # Convert the SQLAlchemy object to the Pydantic model before returning
        return SuccessResponse(
            message=f"Customer with ID {id} updated successfully",
            data=CustomerResponse.model_validate(customer)
        )
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Bank with id {payload.bank_id} not found"
        )
        
@router.delete("/customers/{id}", response_model=CustomerDeletionResponse, responses={
    404: {"model": ErrorResponse, "description": "Not Found: Customer not found"}
})
def delete_customer(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permissions(["customers:delete"]))
):
    """
    Delete a customer entry by ID and return a detailed deletion response.
    """
    customer = db.query(Customer).filter(Customer.id == id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    # Store the details before deleting the object
    response_data = {
        "customer_id": customer.customer_id,
        "bank_id": customer.bank_id,
        "created_by_user_id": customer.created_by_user.id
    }
    
    db.delete(customer)
    db.commit()
    
    return CustomerDeletionResponse(
        message="Customer deleted successfully",
        **response_data
    )