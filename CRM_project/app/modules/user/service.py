import os
import shutil
import uuid
from pathlib import Path
from typing import List
from fastapi import HTTPException, status, UploadFile
from sqlalchemy.orm import Session
from app.models.user import User
from app.modules.user.repository import UserRepository
from app.core.security import get_password_hash
from app.core.password_policy import validate_password, PasswordValidationError
from app.modules.role.service import RoleService
from app.modules.user.schema import UserUpdate, UserStatusUpdate, AdminUserCreate
from app.models.customers import Customer
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
    def upload_avatar(db: Session, user_id: int, avatar_file: UploadFile) -> User:
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        allowed_types = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"]
        if avatar_file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Unsupported file type.")

        # Delete old avatar
        if user.avatar:
            old_avatar_path = Path("app") / user.avatar.lstrip('/')
            if old_avatar_path.exists() and old_avatar_path.is_file():
                try:
                    os.remove(old_avatar_path)
                except OSError:
                    pass

        file_extension = avatar_file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        upload_dir = Path("app/static/avatars")
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        upload_path = upload_dir / unique_filename

        with open(upload_path, "wb") as buffer:
            shutil.copyfileobj(avatar_file.file, buffer)
            
        user.avatar = f"/static/avatars/{unique_filename}"
        return UserRepository.update(db, user)
    @staticmethod
    def delete_user(db: Session, user_id: int) -> dict:
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        has_customers = db.query(Customer).filter(Customer.create_by_user == user.id).first()
        if has_customers:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User cannot be deleted because it has associated customers."
            )

        UserRepository.delete(db, user)
        return {"message": "User deleted successfully"}
