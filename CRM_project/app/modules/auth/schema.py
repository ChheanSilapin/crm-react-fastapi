from __future__ import annotations
from typing import Optional, List
from pydantic import BaseModel, field_validator, Field
from app.core.input_validation import SecurityValidator


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
    permissions: List[str] = Field(default_factory=list)


class UserAuthBase(BaseModel):
    username: str
    password: str


class UserLogin(UserAuthBase):
    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        return SecurityValidator.validate_username_for_login(v)


class UserCreate(UserAuthBase):
    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        return SecurityValidator.validate_username(v)


class AdminUserCreate(UserAuthBase):
    role_id: Optional[int] = None


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str


class PasswordResetRequest(BaseModel):
    new_password: str


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class LogoutResponse(BaseModel):
    message: str
    token_blacklisted: bool


class MessageResponse(BaseModel):
    message: str


class Role(BaseModel):
    name: str
    description: str
    model_config = {"from_attributes": True}
    
class UserResponse(BaseModel):
    id: int
    username: str
    role: Role | None = None
    status : str 
    model_config = {"from_attributes": True}
