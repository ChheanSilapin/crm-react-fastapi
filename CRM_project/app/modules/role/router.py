from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.role import Role

from app.database import get_db
from app.core.dependencies import require_permissions, require_role, get_current_user
from app.modules.role.service import RoleService
from app.models.permission import Permission
from app.modules.role.schema import RoleCreate, RoleUpdate, RoleOut, PermissionOut, RolePermissionAssignment,RoleWithPermissions

router = APIRouter()


@router.get("/roles", response_model=List[RoleOut])
def list_roles(
    db: Session = Depends(get_db),
    _: bool = Depends(require_permissions(["roles:read"])),
) -> List[RoleOut]:
    """List all roles. Requires roles:read permission."""
    roles = RoleService.get_all(db)
    return roles


@router.get("/roles/{role_id}", response_model=RoleWithPermissions)
def get_role(
    role_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(require_permissions(["roles:read"])),
) -> RoleOut:
    """Get specific role by ID. Requires roles:read permission."""
    return RoleService.get_by_id(db, role_id)


@router.post("/roles", response_model=RoleOut)
def create_role(
    role_data: RoleCreate,
    db: Session = Depends(get_db),
    _: bool = Depends(require_permissions(["roles:create"])),
) -> RoleOut:
    return RoleService.create(db, role_data.name, role_data.description)


@router.put("/roles/{role_id}", response_model=RoleOut)
def update_role(
    role_id: int,
    role_data: RoleUpdate,
    db: Session = Depends(get_db),
    _: bool = Depends(require_permissions(["roles:update"])),
) -> RoleOut:
    return RoleService.update(
        db=db,
        role_id=role_id,
        name=role_data.name,
        description=role_data.description
    )


@router.delete("/roles/{role_id}")
def delete_role(
    role_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(require_permissions(["roles:delete"])),
):
    return RoleService.delete(db, role_id)


@router.post("/roles/{role_id}/permissions")
def assign_permissions_to_role(
    role_id: int,
    permission_data: RolePermissionAssignment,
    db: Session = Depends(get_db),
    _: bool = Depends(require_permissions(["roles:create"])),
):
    return RoleService.assign_permissions(db, role_id, permission_data.permission_ids)

@router.get("/roles/{role_id}/users")
def get_role_users(
    role_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(require_permissions(["roles:read"])),
):
    """Get all users assigned to a specific role. Requires roles:read permission."""
    return RoleService.get_role_users(db, role_id)
