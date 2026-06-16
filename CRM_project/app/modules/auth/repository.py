from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.user import User


class AuthRepository:
    """Repository layer for auth database operations (pure DB queries only)."""

    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[User]:
        """Get user by username."""
        stmt = select(User).where(User.username == username)
        return db.execute(stmt).scalars().first()

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return db.get(User, user_id)

    @staticmethod
    def update_user_password(db: Session, user: User, hashed_password: str) -> User:
        """Update user's password hash."""
        user.password_hash = hashed_password
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def create_user(db: Session, username: str, hashed_password: str, role_id: int) -> User:
        """Insert a new user."""
        user = User(
            username=username,
            password_hash=hashed_password,
            role_id=role_id,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
