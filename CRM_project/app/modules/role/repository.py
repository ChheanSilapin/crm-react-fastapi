from typing import List, Optional
from sqlalchemy import select, delete
from sqlalchemy.orm import Session
from app.models.role import Role
from app.models.permission import Permission
from app.models.associations import role_permissions
from sqlalchemy import func, desc
class RoleRepository:
    """Repository layer for role operations."""
    
    @staticmethod
    def get_by_id(db: Session, role_id: int) -> Optional[Role]:
        return db.get(Role, role_id)
    
    @staticmethod
    def get_by_name(db: Session, name: str) -> Optional[Role]:
        stmt = select(Role).where(Role.name == name)
        return db.execute(stmt).scalars().first()
    
    @staticmethod
    def get_all(db: Session) -> List[Role]:
        return db.execute(select(Role)).scalars().all()

    @staticmethod
    def get_all_with_count(db:Session, offset:int=0, limit:int=10):
        total = db.execute(select(func.count(Role.id))).scalar()
        items = db.execute(
            select(Role)
            .order_by(desc(Role.created_at))
            .offset(offset)
            .limit(limit)
        ).scalars().all()
        
        return items, total    
    
    @staticmethod
    def create(db: Session, name: str, description: Optional[str] = None) -> Role:
        role = Role(name=name, description=description)
        db.add(role)
        db.commit()
        db.refresh(role)
        return role

    @staticmethod
    def update(db: Session, role: Role, name: Optional[str] = None, description: Optional[str] = None) -> Role:
        if name is not None:
            role.name = name
        if description is not None:
            role.description = description
        
        db.commit()
        db.refresh(role)
        return role
    
    @staticmethod
    def delete(db: Session, role: Role) -> None:
        db.delete(role)
        db.commit()
    
    @staticmethod
    def assign_permissions(db: Session, role_id: int, permission_ids: List[int]) -> bool:
        role = db.get(Role, role_id)
        if not role:
            return False
        
        # Verify all permission IDs exist
        permissions = db.execute(
            select(Permission).where(Permission.id.in_(permission_ids))
        ).scalars().all()
        
        if len(permissions) != len(permission_ids):
            return False
        
        # Remove existing permissions
        db.execute(
            delete(role_permissions).where(role_permissions.c.role_id == role_id)
        )
        
        # Add new permissions
        for permission_id in permission_ids:
            db.execute(
                role_permissions.insert().values(
                    role_id=role_id, 
                    permission_id=permission_id
                )
            )
        
        db.commit()
        return True
    
    @staticmethod
    def get_permissions(db: Session, role_id: int) -> List[Permission]:
        role = db.get(Role, role_id)
        if not role:
            return []
        return role.permissions
    
    @staticmethod
    def remove_permission(db: Session, role_id: int, permission_id: int) -> bool:
        result = db.execute(
            delete(role_permissions).where(
                role_permissions.c.role_id == role_id,
                role_permissions.c.permission_id == permission_id
            )
        )
        db.commit()
        return result.rowcount > 0
