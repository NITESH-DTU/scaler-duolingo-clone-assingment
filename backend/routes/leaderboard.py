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
    users = db.query(User).order_by(User.xp.desc(), User.id.asc()).all()
    top_users = users[:10]
    current_user = next((user for user in users if user.id == 1), None)
    if current_user and current_user not in top_users:
        top_users.append(current_user)

    return [
        {
            "rank": next(index for index, candidate in enumerate(users, start=1) if candidate.id == user.id),
            "name": user.name,
            "xp": user.xp
        }
        for user in top_users
    ]
