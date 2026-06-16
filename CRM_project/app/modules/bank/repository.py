from typing import List, Tuple, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_

from app.models.banks import Bank

class BankRepository:
    @staticmethod
    def get_bank_by_name(db: Session, bank_name: str) -> Optional[Bank]:
        return db.query(Bank).filter(Bank.bank_name == bank_name).first()

    @staticmethod
    def get_bank_by_name_excluding_id(db: Session, bank_name: str, exclude_id: int) -> Optional[Bank]:
        return db.query(Bank).filter(
            and_(
                Bank.bank_name == bank_name,
                Bank.bank_id != exclude_id
            )
        ).first()

    @staticmethod
    def get_bank_by_id(db: Session, bank_id: int) -> Optional[Bank]:
        return db.query(Bank).filter(Bank.bank_id == bank_id).first()

    @staticmethod
    def get_all_banks(db: Session, limit: int, offset: int) -> Tuple[List[Bank], int]:
        total_count = db.query(Bank).count()
        items = (
            db.query(Bank)
            .options(joinedload(Bank.created_by_user))
            .order_by(Bank.bank_id.desc())
            .limit(limit)
            .offset(offset)
            .all()
        )
        return items, total_count

    @staticmethod
    def create_bank(db: Session, new_bank: Bank) -> Bank:
        db.add(new_bank)
        db.commit()
        db.refresh(new_bank)
        return new_bank

    @staticmethod
    def update_bank(db: Session, bank: Bank, update_data: dict) -> Bank:
        for key, value in update_data.items():
            setattr(bank, key, value)
        db.commit()
        db.refresh(bank)
        return bank

    @staticmethod
    def update_bank_logo(db: Session, bank: Bank, logo_url: str) -> Bank:
        bank.logo = logo_url
        db.commit()
        db.refresh(bank)
        return bank

    @staticmethod
    def delete_bank(db: Session, bank: Bank) -> None:
        db.delete(bank)
        db.commit()
