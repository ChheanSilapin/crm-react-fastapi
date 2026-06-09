from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import require_permissions, require_role, get_current_user
from app.modules.user.service import UserService
from app.modules.user.schema import (
    UserOut,
    UserUpdate,
    UserStatusUpdate,
    UserWithRole,
    AdminUserCreate,
)

router = APIRouter()

@router.get("/users", response_model=List[UserOut])
def list_users(
    db: Session = Depends(get_db),
    _: bool = Depends(require_permissions(["users:read"])),
):
    """List all users. Requires users:read permission."""
    return UserService.get_all_users(db)

@router.get("/users/{user_id}", response_model=UserOut)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(require_permissions(["users:read"])),
):
    """Get specific user by ID. Requires users:read permission."""
    return UserService.get_user_by_id(db, user_id)

@router.put("/users/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    _: bool = Depends(require_permissions(["users:update"])),
):
    """Update user information."""
    return UserService.update_user(db, user_id, user_update)

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(require_permissions(["users:delete"])),
):
    """Permanently delete a user account."""
    return UserService.delete_user(db, user_id)

@router.patch("/users/{user_id}/status")
def update_user_status(
    user_id: int,
    status_update: UserStatusUpdate,
    db: Session = Depends(get_db),
    _: bool = Depends(require_permissions(["users:update"])),
):
    """Update only the status of a user account."""
    user = UserService.update_user_status(db, user_id, status_update)
    return {"message": f"User status updated to {user.status}", "user_id": user.id}

@router.get("/users/{user_id}/with-role", response_model=UserWithRole)
def get_user_with_role(
    user_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(require_permissions(["users:read"])),
):
    """Get user with full role information. Requires users:read permission."""
    return UserService.get_user_with_role(db, user_id)

@router.post("/users", response_model=UserOut)
def create_user(
    user_data: AdminUserCreate,
    db: Session = Depends(get_db),
    _: bool = Depends(require_role("admin")),
):
    """Create a new user account. Only admin users can perform this action."""
    return UserService.create_admin_user(db, user_data)
