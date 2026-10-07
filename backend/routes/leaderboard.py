from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import User

router = APIRouter(
    prefix="/api/v1/leaderboard",
    tags=["Leaderboard"]
)


@router.get("")
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).order_by(
        User.xp.desc()
    ).limit(10).all()

    return [
        {
            "rank": index + 1,
            "name": user.name,
            "xp": user.xp
        }
        for index, user in enumerate(users)
    ]