from typing import Optional
from datetime import date, datetime, timedelta, time as dtime
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.customers import Customer
from app.models.banks import Bank
from app.models.user import User
from app.modules.customer.repository import CustomerRepository
from app.modules.customer.schema import CustomerCreate, CustomerUpdate, CustomerResponse, DateFilter

class CustomerService:
    @staticmethod
    def _get_date_filter_bounds(date_filter: DateFilter):
        today = date.today()
        bounds = {
            DateFilter.TODAY: (today, today, "Show customers created today"),
            DateFilter.YESTERDAY: (today - timedelta(days=1), today - timedelta(days=1), "Show customers created yesterday"),
            DateFilter.THIS_WEEK: (today - timedelta(days=today.weekday()), today, "Show customers created this week"),
            DateFilter.THIS_MONTH: (today.replace(day=1), today, "Show customers created this month"),
            DateFilter.LAST_7_DAYS: (today - timedelta(days=7), today, "Show customers created in the last 7 days"),
            DateFilter.LAST_MONTH: (
                (today.replace(day=1) - timedelta(days=1)).replace(day=1),
                today.replace(day=1) - timedelta(days=1),
                "Show customers created last month"
            ),
            DateFilter.ALL: (None, None, "Show all customers")
        }
        
        start_d, end_d, msg = bounds.get(date_filter, (None, None, "Show customers"))
        
        start_dt = datetime.combine(start_d, dtime.min) if start_d else None
        end_dt = datetime.combine(end_d, dtime.max) if end_d else None
        
        return start_dt, end_dt, msg

    @staticmethod
    def create_customer(db: Session, payload: CustomerCreate, current_user: User) -> Customer:
        # Check if bank exists
        bank = db.query(Bank).filter(Bank.bank_id == payload.bank_id).first()
        if not bank:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Bank with id {payload.bank_id} not found")

        # Check if customer ID already exists
        existing_customer = CustomerRepository.get_customer_by_customer_id(db, payload.customer_id)
        if existing_customer:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Customer with id {payload.customer_id} already exists")

        new_customer = Customer(
            **payload.model_dump(),
            create_by_user=current_user.id,
        )

        return CustomerRepository.create_customer(db, new_customer)

    @staticmethod
    def list_customers(
        db: Session,
        page: int,
        limit: Optional[int],
        date_filter: Optional[DateFilter],
        start_date: Optional[datetime],
        end_date: Optional[datetime],
        currency: Optional[str],
        txn_type: Optional[str]
    ):
        start_dt, end_dt = None, None
        message = "Show customers"

        if date_filter:
            start_dt, end_dt, message = CustomerService._get_date_filter_bounds(date_filter)
        else:
            if start_date:
                start_dt = start_date
                message = f"Show customers from {start_date.strftime('%Y-%m-%d')}"
            if end_date:
                end_dt = end_date
                message += f" to {end_date.strftime('%Y-%m-%d')}"

        if start_dt and end_dt and end_dt < start_dt:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid time range: end_date must be greater than or equal to start_date"
            )

        clean_txn_type = None
        if txn_type:
            t_lower = txn_type.strip().lower()
            clean_txn_type = "withdrawal" if t_lower in ("withdraw", "withdrawal") else t_lower
        
        if limit is None and date_filter == DateFilter.ALL:
            calc_limit = None
            offset = 0
        else:
            calc_limit = limit or 10
            offset = (page - 1) * calc_limit

        items, total_count = CustomerRepository.get_filtered_customers(
            db=db, start_dt=start_dt, end_dt=end_dt,
            currency=currency, txn_type=clean_txn_type, limit=calc_limit, offset=offset
        )
        
        if total_count == 0:
            pages = 1
            has_next = False
            has_prev = False
            items = []
            message += " (no customers found)"
            limit_for_response = limit or 10
        else:
            limit_for_response = calc_limit if calc_limit is not None else total_count
            pages = (total_count + limit_for_response - 1) // limit_for_response
            has_next = offset + limit_for_response < total_count
            has_prev = offset > 0

        return {
            "items": items, "total": total_count, "limit": limit_for_response,
            "offset": offset, "message": message, "page": page, "pages": pages,
            "has_next": has_next, "has_prev": has_prev
        }

    @staticmethod
    def get_customer(db: Session, customer_id: int) -> Customer:
        customer = CustomerRepository.get_customer_by_id(db, customer_id)
        if not customer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
        return customer

    @staticmethod
    def update_customer(db: Session, customer_id: int, payload: CustomerUpdate) -> Customer:
        customer = CustomerRepository.get_customer_by_id(db, customer_id)
        if not customer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

        update_data = payload.model_dump(exclude_unset=True)
        try:
            updated_customer = CustomerRepository.update_customer(db, customer, update_data)
            return updated_customer
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Conflict updating customer (possibly bank_id {payload.bank_id} not found)"
            )

    @staticmethod
    def delete_customer(db: Session, customer_id: int) -> dict:
        customer = CustomerRepository.get_customer_by_id(db, customer_id)
        if not customer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

        response_data = {
            "customer_id": customer.customer_id,
            "bank_id": customer.bank_id,
            "created_by_user_id": customer.created_by_user.id if customer.created_by_user else None
        }
        
        CustomerRepository.delete_customer(db, customer)
        return response_data