from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User
from app.modules.user.repository import UserRepository
from app.core.security import get_password_hash
from app.core.password_policy import validate_password, PasswordValidationError
from app.services.role_service import RoleService
from app.modules.user.schema import UserUpdate, UserStatusUpdate, AdminUserCreate
import math
class UserService:
    """Service layer for user business logic and validation."""

    @staticmethod
    def get_all_users(db: Session, offset: int = 0, limit: int = 10):
        items, total = UserRepository.get_all_with_count(db, offset=offset, limit=limit)
        
        current_page = (offset // limit) + 1
        total_pages = math.ceil(total / limit) if total > 0 else 1
        
        return {
            "items": items,
            "total": total,
            "limit": limit,
            "offset": offset,
            "page": current_page,
            "pages": total_pages,
            "has_next": current_page < total_pages,
            "has_prev": current_page > 1
        }

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User:
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    @staticmethod
    def get_user_with_role(db: Session, user_id: int) -> User:
        return UserService.get_user_by_id(db, user_id)

    @staticmethod
    def create_admin_user(db: Session, user_data: AdminUserCreate) -> User:
        existing_user = UserRepository.get_by_username(db, user_data.username)
        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

        role_id = user_data.role_id
        if role_id is not None:
            role = RoleService.get_by_id(db, role_id)
            if not role:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Role not found")
        else:
            default_role = RoleService.get_by_name(db, "user")
            if not default_role:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Default 'user' role not found. Please contact administrator."
                )
            role_id = default_role.id

        try:
            validate_password(user_data.password, user_data.username)
        except PasswordValidationError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Password validation failed: {'; '.join(e.errors)}"
            )

        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            username=user_data.username,
            password_hash=hashed_password,
            role_id=role_id
        )
        return UserRepository.create(db, new_user)

    @staticmethod
    def update_user(db: Session, user_id: int, user_update: UserUpdate) -> User:
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        if user_update.username is not None:
            existing_user = UserRepository.get_by_username(db, user_update.username)
            if existing_user and existing_user.id != user_id:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")
            user.username = user_update.username

        if user_update.status is not None:
            if user_update.status not in ["active", "inactive", "suspended"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid status. Must be 'active', 'inactive', or 'suspended'"
                )
            user.status = user_update.status

        if user_update.role_id is not None:
            role = RoleService.get_by_id(db, user_update.role_id)
            if not role:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Role not found")
            user.role_id = user_update.role_id

        return UserRepository.update(db, user)

    @staticmethod
    def update_user_status(db: Session, user_id: int, status_update: UserStatusUpdate) -> User:
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        if status_update.status not in ["active", "inactive", "suspended"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status. Must be 'active', 'inactive', or 'suspended'"
            )

        user.status = status_update.status
        return UserRepository.update(db, user)

    @staticmethod
    def delete_user(db: Session, user_id: int) -> dict:
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        UserRepository.delete(db, user)
        return {"message": "User deleted successfully"}
