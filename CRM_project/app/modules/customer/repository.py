from typing import Optional, Tuple, List
from datetime import date, datetime
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, and_
from sqlalchemy.exc import IntegrityError

from app.models.customers import Customer

class CustomerRepository:
    @staticmethod
    def get_filtered_customers(
        db: Session,
        start_dt: Optional[datetime],
        end_dt: Optional[datetime],
        currency: Optional[str],
        txn_type: Optional[str],
        limit: Optional[int],
        offset: int
    ) -> Tuple[List[Customer], int]:
        
        query = db.query(Customer)

        # 1. Date/Time Filter
        if start_dt and end_dt:
            query = query.filter(and_(Customer.create_at >= start_dt, Customer.create_at <= end_dt))
        elif start_dt:
            query = query.filter(Customer.create_at >= start_dt)
        elif end_dt:
            query = query.filter(Customer.create_at <= end_dt)

        # 3. Currency Filter
        if currency:
            query = query.filter(Customer.currency == currency.upper())

        # 4. Transaction Type Filter
        if txn_type:
            query = query.filter(func.lower(Customer.type) == txn_type)

        # Total Count
        total_count = query.count()

        # 5. Pagination and Lazy Loading Optimization
        query = query.order_by(Customer.id.desc()).options(
            joinedload(Customer.created_by_user),
            joinedload(Customer.bank, innerjoin=False)
        )

        if limit is not None:
            items = query.limit(limit).offset(offset).all()
        else:
            items = query.all()

        return items, total_count

    @staticmethod
    def get_customer_by_id(db: Session, customer_id: int) -> Optional[Customer]:
        return (
            db.query(Customer)
            .options(joinedload(Customer.created_by_user), joinedload(Customer.bank, innerjoin=False))
            .filter(Customer.id == customer_id)
            .first()
        )

    @staticmethod
    def get_customer_by_customer_id(db: Session, customer_id_str: str) -> Optional[Customer]:
        return db.query(Customer).filter(Customer.customer_id == customer_id_str).first()

    @staticmethod
    def create_customer(db: Session, new_customer: Customer) -> Customer:
        db.add(new_customer)
        db.commit()
        db.refresh(new_customer)
        return new_customer

    @staticmethod
    def update_customer(db: Session, customer: Customer, update_data: dict) -> Customer:
        for key, value in update_data.items():
            setattr(customer, key, value)
        db.commit()
        db.refresh(customer)
        return customer

    @staticmethod
    def delete_customer(db: Session, customer: Customer) -> None:
        db.delete(customer)
        db.commit()