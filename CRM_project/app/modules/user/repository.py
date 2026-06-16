from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, desc, func
from app.models.user import User

class UserRepository:
    """Repository layer for pure user DB operations."""

    @staticmethod
    def get_by_username(db: Session, username: str) -> Optional[User]:
        stmt = select(User).where(User.username == username)
        return db.execute(stmt).scalars().first()

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> Optional[User]:
        return db.get(User, user_id)

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        return db.execute(select(User).order_by(desc(User.created_at)).offset(skip).limit(limit)).scalars().all()

    @staticmethod
    def get_all_with_count(db: Session, offset: int = 0, limit: int = 100):
        total = db.execute(select(func.count(User.id))).scalar()
        items = db.execute(
            select(User)
            .order_by(desc(User.created_at))
            .offset(offset)
            .limit(limit)
        ).scalars().all()
        
        return items, total

    @staticmethod
    def create(db: Session, user: User) -> User:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update(db: Session, user: User) -> User:
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def delete(db: Session, user: User) -> bool:
        db.delete(user)
        db.commit()
        return True
