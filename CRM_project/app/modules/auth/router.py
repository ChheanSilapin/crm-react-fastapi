from typing import Any
from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import require_permissions, require_role, get_current_user
from app.models.user import User
from app.modules.auth.service import AuthService
from app.modules.auth.schema import (
    Token,
    UserLogin,
    PasswordChangeRequest,
    LogoutResponse,
    MessageResponse,
    UserResponse,
)

router = APIRouter()


@router.post("/login", response_model=Token)
def login(data: UserLogin, request: Request, response: Response, db: Session = Depends(get_db)):
    return AuthService.login(db, data, request=request, response=response)


@router.post("/refresh", response_model=Token)
def refresh(request: Request, db: Session = Depends(get_db)):
    return AuthService.refresh(db, request=request)


@router.post("/logout", response_model=LogoutResponse)
def logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AuthService.logout(db, request=request, response=response)


@router.get("/password-policy")
def get_password_policy():
    return AuthService.get_password_policy()


@router.post("/change-password", response_model=MessageResponse)
def change_password(
    password_request: PasswordChangeRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AuthService.change_password(
        db, current_user,
        current_password=password_request.current_password,
        new_password=password_request.new_password,
        request=request,
    )


@router.get("/me",response_model=UserResponse)
def read_current_user(
    current_user: User = Depends(get_current_user),
    _: bool = Depends(require_permissions(["users:read"])),
) -> Any:
    return current_user
