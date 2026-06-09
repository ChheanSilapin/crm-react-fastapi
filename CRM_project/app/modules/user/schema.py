from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class UserBase(BaseModel):
    username: str
    status: str
    role_id: int

class UserOut(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    username: Optional[str] = None
    status: Optional[str] = None
    role_id: Optional[int] = None

class UserStatusUpdate(BaseModel):
    status: str

class RoleOut(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)

class UserWithRole(UserOut):
    role: Optional[RoleOut] = None

class AdminUserCreate(BaseModel):
    username: str
    password: str
    role_id: Optional[int] = None