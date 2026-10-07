from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import User

router = APIRouter(prefix="/api/v1", tags=["User"])

DEFAULT_USER_ID = 1


@router.get("/me")
def get_me(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "name": user.name,
        "xp": user.xp,
        "streak": user.streak,
        "hearts": user.hearts,
        "gems": user.gems
    }


@router.post("/hearts/refill")
def refill_heart(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hearts = min(user.hearts + 1, 5)

    db.commit()

    return {
        "hearts": user.hearts
    }