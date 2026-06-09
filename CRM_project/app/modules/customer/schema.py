from typing import Optional
from datetime import datetime, timezone
from decimal import Decimal
from enum import Enum
from pydantic import BaseModel, Field
from app.schemas.bank import BankSummary


class DateFilter(str, Enum):
    """Date filter shortcuts for customer queries."""
    TODAY = "today"
    YESTERDAY = "yesterday"
    THIS_WEEK = "this_week"
    THIS_MONTH = "this_month"
    LAST_7_DAYS = "last_7_days"
    LAST_MONTH = "last_month"
    ALL = "all"

class CustomerBase(BaseModel):
    customer_id: str = Field(..., max_length=20)
    type: str = Field(..., max_length=20)
    currency: str = Field(..., max_length=3)
    credit: Decimal = Field(
        ...,
        ge=0,
        le=Decimal('9999999999999.99'),
        example=Decimal('1000.00'),
        description="Credit amount (non-negative, max 9,999,999,999,999.99)"
    )
    amount: Decimal = Field(
        ...,
        ge=0,
        le=Decimal('9999999999999.99'),
        example=Decimal('1000.00'),
        description="Amount (non-negative, max 9,999,999,999,999.99)"
    )
    bank_id: int = Field(...)
    note: Optional[str] = Field(None, max_length=255)
    
class CustomerCreate(CustomerBase):
    pass
    
class CustomerUpdate(BaseModel):
    customer_id: Optional[str] = Field(None, max_length=20)
    type: Optional[str] = Field(None, max_length=20)
    currency: Optional[str] = Field(None, max_length=3)
    credit: Optional[Decimal] = Field(
        None,
        ge=0,
        le=Decimal('9999999999999.99')
    )
    amount: Optional[Decimal] = Field(
        None,
        ge=0,
        le=Decimal('9999999999999.99')
    )
    bank_id: Optional[int] = Field(None)
    note: Optional[str] = Field(None, max_length=255)

class CustomerDeletionResponse(BaseModel):
    """
    Schema for a detailed response after a customer has been deleted.
    """
    message: str = "Customer deleted successfully"
    customer_id: str
    bank_id: Optional[int]
    created_by_user_id: Optional[int]
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        example="2025-08-12T07:06:45.547759Z",
        description="Response timestamp"
    )

class User(BaseModel):
    id: int
    username: str
    class Config:
        from_attributes = True

class CustomerResponse(BaseModel):
    id: int
    customer_id: str
    type: str
    currency: str
    credit: Decimal
    amount: Decimal
    note: Optional[str]
    bank: BankSummary
    create_at: datetime
    update_at: datetime
    created_by_user: User
    class Config:
        from_attributes = True
