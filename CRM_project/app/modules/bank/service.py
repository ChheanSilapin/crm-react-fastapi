import os
import shutil
import uuid
from pathlib import Path
from typing import Optional
from fastapi import HTTPException, status, UploadFile
from sqlalchemy.orm import Session

from app.models.banks import Bank
from app.models.user import User
from app.models.customers import Customer
from app.modules.bank.repository import BankRepository
from app.modules.bank.schema import BankCreate, BankResponse

class BankService:
    @staticmethod
    def create_bank(db: Session, bank_name: str, description: Optional[str], logo: Optional[UploadFile], current_user: User) -> Bank:
        existing_bank = BankRepository.get_bank_by_name(db, bank_name)
        if existing_bank:
            raise HTTPException(status_code=409, detail="Bank with this name already exists.")

        logo_url = None
        if logo:
            allowed_types = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"]
            if logo.content_type not in allowed_types:
                raise HTTPException(status_code=400, detail="Unsupported file type.")

            file_extension = logo.filename.split(".")[-1]
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            upload_path = f"app/static/logos/{unique_filename}"

            with open(upload_path, "wb") as buffer:
                shutil.copyfileobj(logo.file, buffer)
                
            logo_url = f"/static/logos/{unique_filename}"

        new_bank = Bank(
            bank_name=bank_name,
            description=description,
            logo=logo_url,
            created_by_user_id=current_user.id
        )
        return BankRepository.create_bank(db, new_bank)

    @staticmethod
    def list_banks(db: Session, limit: int, offset: int) -> dict:
        items, total_count = BankRepository.get_all_banks(db, limit, offset)
        return {"items": items, "total_count": total_count}

    @staticmethod
    def get_bank(db: Session, bank_id: int) -> Bank:
        bank = BankRepository.get_bank_by_id(db, bank_id)
        if not bank:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bank not found")
        return bank

    @staticmethod
    def update_bank(db: Session, bank_id: int, bank_name: Optional[str] = None, description: Optional[str] = None, logo: Optional[UploadFile] = None) -> Bank:
        bank = BankRepository.get_bank_by_id(db, bank_id)
        if not bank:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bank not found")

        update_data = {}

        if bank_name is not None:
            existing_bank = BankRepository.get_bank_by_name_excluding_id(db, bank_name, bank_id)
            if existing_bank:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="A bank with this name already exists."
                )
            update_data["bank_name"] = bank_name
            
        if description is not None:
            update_data["description"] = description

        if logo is not None:
            # Delete old logo
            if bank.logo:
                old_logo_path = Path("app") / bank.logo.lstrip('/')
                if old_logo_path.exists() and old_logo_path.is_file():
                    try:
                        os.remove(old_logo_path)
                    except OSError:
                        pass

            allowed_types = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"]
            if logo.content_type not in allowed_types:
                raise HTTPException(status_code=400, detail="Unsupported file type.")

            file_extension = logo.filename.split(".")[-1]
            filename = f"bank_{bank.bank_id}.{file_extension}"
            upload_path = f"app/static/logos/{filename}"
            
            with open(upload_path, "wb") as buffer:
                shutil.copyfileobj(logo.file, buffer)
                
            logo_url = f"/static/logos/{filename}"
            update_data["logo"] = logo_url

        return BankRepository.update_bank(db, bank, update_data)

    @staticmethod
    def delete_bank(db: Session, bank_id: int) -> dict:
        bank = BankRepository.get_bank_by_id(db, bank_id)
        if not bank:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bank not found")

        # Note: We need to query Customer here. This cross-module access is fine for now
        # but in strict Clean Architecture, it might belong in a higher-level orchestrator or use CustomerService.
        has_customers = db.query(Customer).filter(Customer.bank_id == bank.bank_id).first()
        if has_customers:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Bank cannot be deleted because it has associated customers."
            )

        if bank.logo:
            logo_path = Path("app") / bank.logo.lstrip('/')
            if logo_path.exists() and logo_path.is_file():
                try:
                    os.remove(logo_path)
                except OSError:
                    pass

        response_data = {
            "bank_id": bank.bank_id,
            "bank_name": bank.bank_name,
            "created_by_user_id": bank.created_by_user_id
        }

        BankRepository.delete_bank(db, bank)
        return response_data
