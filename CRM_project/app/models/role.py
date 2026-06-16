from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from .associations import role_permissions



class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(String(255))

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Existing relationships
    users = relationship("User", back_populates="role")
    permissions = relationship(
        "Permission",
        secondary=role_permissions,
        back_populates="roles",
        lazy="selectin",
    )

    def get_all_permissions(self):
        """
        Get all permissions for this role.
        """
        return set(self.permissions)

    def get_permission_names(self):
        """Get all permission names."""
        permissions = self.get_all_permissions()
        return [perm.name for perm in permissions]

    def has_permission(self, permission_name: str) -> bool:
        """Check if role has a specific permission."""
        permission_names = self.get_permission_names()
        return permission_name in permission_names

    def __repr__(self):
        return f"<Role(id={self.id}, name='{self.name}')>"
