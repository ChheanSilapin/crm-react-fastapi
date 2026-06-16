from typing import Optional
from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.orm import Session
from pathlib import Path

from app.database import get_db
from app.models.user import User
from app.modules.bank.schema import BankCreate, BankResponse, BankDeletionResponse
from app.schemas.common import ErrorResponse, ListResponse, SuccessResponse
from app.core.dependencies import require_permissions
from app.modules.bank.service import BankService

router = APIRouter(tags=["banks"])

@router.post("/banks", response_model=SuccessResponse[BankResponse])
def create_bank(
    bank_name: str = Form(...),
    description: str = Form(None),
    logo: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permissions(["banks:create"]))
):
    """Creates a new bank with an optional logo upload."""
    new_bank = BankService.create_bank(
        db=db, bank_name=bank_name, description=description, logo=logo, current_user=current_user
    )
    return SuccessResponse(
        message="Bank created successfully",
        data=BankResponse.model_validate(new_bank)
    )

@router.get("/banks", response_model=ListResponse[BankResponse])
def list_banks(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permissions(["banks:read"]))
):
    result = BankService.list_banks(db=db, limit=limit, offset=offset)
    total_count = result["total_count"]
    items = result["items"]
    
    message = f"Found {len(items)} banks out of {total_count} total."
    return ListResponse[BankResponse](message=message, items=items, total=total_count, limit=limit, offset=offset)

@router.get("/banks/{bank_id}", response_model=SuccessResponse[BankResponse])
def get_bank(
    bank_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permissions(["banks:read"]))
):
    bank = BankService.get_bank(db=db, bank_id=bank_id)
    return SuccessResponse(
        message="Bank retrieved successfully",
        data=BankResponse.model_validate(bank)
    )

@router.put("/banks/{bank_id}", response_model=SuccessResponse[BankResponse])
def update_bank(
    bank_id: int,
    bank_name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    logo: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permissions(["banks:update"]))
):
    updated_bank = BankService.update_bank(
        db=db, bank_id=bank_id, bank_name=bank_name, description=description, logo=logo
    )
    return SuccessResponse(
        message=f"Bank with ID {bank_id} updated successfully",
        data=BankResponse.model_validate(updated_bank)
    )

STATIC_DIR = Path(__file__).parent.parent.parent / "static"

@router.delete("/banks/{bank_id}", response_model=BankDeletionResponse)
def delete_bank(
    bank_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permissions(["banks:delete"]))
):
    response_data = BankService.delete_bank(db=db, bank_id=bank_id)
    return BankDeletionResponse(**response_data)