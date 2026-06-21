from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.role import Role
from app.models.permission import Permission
from app.modules.role.repository import RoleRepository
import math

class RoleService:
    """Service layer for role operations."""
    
    @staticmethod
    def get_by_id(db: Session, role_id: int) -> Role:
        """Get role by ID."""
        role = RoleRepository.get_by_id(db, role_id)
        if not role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found",
            )
        return role
    
    @staticmethod
    def get_by_name(db: Session, name: str) -> Optional[Role]:
        """Get role by name."""
        return RoleRepository.get_by_name(db, name)
    
    @staticmethod
    def get_all(db: Session, offset: int = 0, limit: int = 10):
        """Get all roles."""
        items, total = RoleRepository.get_all_with_count(db, offset=offset, limit=limit)
        
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
    def create(db: Session, name: str, description: Optional[str] = None) -> Role:
        """Create a new role."""
        existing_role = RoleRepository.get_by_name(db, name)
        if existing_role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role with this name already exists"
            )
        try:
            return RoleRepository.create(db, name, description)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    @staticmethod
    def update(
        db: Session,
        role_id: int,
        name: Optional[str] = None,
        description: Optional[str] = None,
    ) -> Role:
        """Update role information."""
        role = RoleRepository.get_by_id(db, role_id)
        if not role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found",
            )
        
        if name is not None:
            existing_role = RoleRepository.get_by_name(db, name)
            if existing_role and existing_role.id != role_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Role with this name already exists"
                )
        
        return RoleRepository.update(db, role, name, description)
    
    @staticmethod
    def delete(db: Session, role_id: int) -> dict:
        """Delete a role."""
        role = RoleRepository.get_by_id(db, role_id)
        if not role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found",
            )
            
        if role.users:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete role that is assigned to users"
            )
        
        RoleRepository.delete(db, role)
        return {"message": "Role deleted successfully"}
    
    @staticmethod
    def assign_permissions(db: Session, role_id: int, permission_ids: List[int]) -> dict:
        """Assign permissions to a role (replaces existing permissions)."""
        if not permission_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Permission IDs are required"
            )
            
        success = RoleRepository.assign_permissions(db, role_id, permission_ids)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role not found or some permissions not found"
            )
            
        return {
            "message": "Permissions assigned successfully",
            "role_id": role_id,
            "assigned_permissions": permission_ids
        }
    
    @staticmethod
    def get_role_users(db: Session, role_id: int) -> dict:
        """Get all users assigned to a specific role."""
        role = RoleRepository.get_by_id(db, role_id)
        if not role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found",
            )
            
        users = [
            {
                "id": user.id,
                "user_name": user.user_name,
                "status": user.status,
                "created_at": user.created_at
            }
            for user in role.users
        ]
        
        return {
            "role_id": role_id,
            "role_name": role.name,
            "users": users,
            "user_count": len(users)
        }
    

    

