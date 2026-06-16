from typing import Optional
from datetime import datetime
from fastapi import HTTPException, status, Request, Response
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.password_policy import (
    get_password_requirements,
    validate_password,
    PasswordValidationError,
)
from app.core.rate_limiting import check_auth_rate_limit, record_auth_attempt
from app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_token,
    verify_token_with_blacklist,
    verify_password,
    get_password_hash,
)
from app.modules.role.service import RoleService
from app.services.token_blacklist_service import TokenBlacklistService
from app.modules.auth.repository import AuthRepository
from app.models.user import User


class AuthService:
    @staticmethod
    def login(
        db: Session,
        data,
        request: Request,
        response: Response,
    ) -> dict:
        check_auth_rate_limit(
            request, "login",
            max_attempts=5,
            window_minutes=15,
            username=data.username,
        )

        user = AuthRepository.get_user_by_username(db, data.username)
        if not user or not verify_password(data.password, user.password_hash):
            record_auth_attempt(request, "login", data.username, success=False)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        record_auth_attempt(request, "login", data.username, success=True)

        tokens = AuthService._create_token_pair(user)

        # Set refresh token cookie
        response.set_cookie(
            key="refresh_token",
            value=tokens["refresh_token"],
            httponly=settings.COOKIE_HTTPONLY,
            secure=settings.COOKIE_SECURE,
            samesite=settings.COOKIE_SAMESITE,
        )

        return tokens

    # ── Refresh ──────────────────────────────────────────────────────────
    @staticmethod
    def refresh(db: Session, request: Request) -> dict:
        """Validate refresh‑token cookie and return a new access token."""
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing refresh token",
            )

        payload = verify_token_with_blacklist(refresh_token, db)
        if not payload or payload.get("typ") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
            )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
            )

        user = AuthRepository.get_user_by_id(db, int(user_id))
        if not user or user.status != "active":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
            )

        access_token = create_access_token(subject=str(user.id))
        return {"access_token": access_token, "token_type": "bearer"}

    # ── Logout ───────────────────────────────────────────────────────────
    @staticmethod
    def logout(
        db: Session,
        request: Request,
        response: Response,
    ) -> dict:
        """Blacklist tokens and clear refresh cookie."""
        # Extract access token
        auth_header = request.headers.get("authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid authorization header",
            )
        access_token = auth_header.split(" ")[1]

        blacklist_success = AuthService._blacklist_token(db, access_token)

        # Blacklist refresh token if present
        refresh_token = request.cookies.get("refresh_token")
        if refresh_token:
            AuthService._blacklist_token(db, refresh_token)

        # Clear cookie
        response.delete_cookie(
            key="refresh_token",
            path="/",
            httponly=settings.COOKIE_HTTPONLY,
            secure=settings.COOKIE_SECURE,
            samesite=settings.COOKIE_SAMESITE,
        )

        return {
            "message": "Successfully logged out",
            "token_blacklisted": blacklist_success,
        }

    # ── Change password ──────────────────────────────────────────────────
    @staticmethod
    def change_password(
        db: Session,
        current_user: User,
        current_password: str,
        new_password: str,
        request: Request,
    ) -> dict:
        """Validate and change the current user's password."""
        check_auth_rate_limit(
            request, "password_change",
            max_attempts=3,
            window_minutes=30,
            username=current_user.user_name,
        )

        success = False
        try:
            user = AuthRepository.get_user_by_id(db, current_user.id)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found",
                )

            if not verify_password(current_password, user.password_hash):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Current password is incorrect",
                )

            try:
                validate_password(new_password, user.username)
            except PasswordValidationError as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"New password validation failed: {'; '.join(e.errors)}",
                )

            if verify_password(new_password, user.password_hash):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="New password must be different from current password",
                )

            hashed = get_password_hash(new_password)
            AuthRepository.update_user_password(db, user, hashed)
            success = True
            return {"message": "Password changed successfully"}
        finally:
            record_auth_attempt(
                request, "password_change",
                current_user.user_name, success=success,
            )

    # ── Password policy (public) ─────────────────────────────────────────
    @staticmethod
    def get_password_policy() -> dict:
        """Return password policy requirements."""
        return get_password_requirements()

    # ── Register ─────────────────────────────────────────────────────────
    @staticmethod
    def register_user(
        db: Session,
        username: str,
        password: str,
        role_name: str = "user",
    ) -> Optional[User]:
        """Register a new user with a default role."""
        existing = AuthRepository.get_user_by_username(db, username)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists",
            )

        default_role = RoleService.get_by_name(db, role_name)
        if not default_role:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Default '{role_name}' role not found",
            )

        try:
            validate_password(password, username)
        except PasswordValidationError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Password validation failed: {'; '.join(e.errors)}",
            )

        hashed = get_password_hash(password)
        return AuthRepository.create_user(
            db=db,
            username=username,
            hashed_password=hashed,
            role_id=default_role.id,
        )

    # ── Private helpers ──────────────────────────────────────────────────
    @staticmethod
    def _create_token_pair(user: User) -> dict:
        """Create access + refresh token pair."""
        return {
            "access_token": create_access_token(subject=str(user.id)),
            "refresh_token": create_refresh_token(subject=str(user.id)),
            "token_type": "bearer",
        }

    @staticmethod
    def _blacklist_token(db: Session, token: str) -> bool:
        """Parse token and add its JTI to the blacklist."""
        payload = verify_token(token)
        if not payload:
            return False

        jti = payload.get("jti")
        exp = payload.get("exp")
        if not jti or not exp:
            return False

        expires_at = datetime.fromtimestamp(
            exp, tz=datetime.now().astimezone().tzinfo
        )
        return TokenBlacklistService.blacklist_token(db, jti, expires_at)
