from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import require_permissions, require_role, get_current_user
from app.services.permission_service import PermissionService
from app.modules.role.schema import PermissionOut

router = APIRouter()


@router.get("/permissions", response_model=List[PermissionOut])
def list_permissions(
    db: Session = Depends(get_db),
    _: bool = Depends(require_permissions(["permissions:read"])),
) -> List[PermissionOut]:
    """List all permissions. Requires permissions:read permission."""
    permissions = PermissionService.get_all(db)
    return permissions
