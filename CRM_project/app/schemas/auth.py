from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    pass

class RoleUpdate(RoleBase):
    name: Optional[str] = None

class RoleOut(RoleBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PermissionBase(BaseModel):
    name: str
    description: Optional[str] = None

class PermissionOut(PermissionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class RolePermissionAssignment(BaseModel):
    permission_ids: List[int]
