from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import (
    User,
    UserLessonProgress,
    UserSkillProgress
)

router = APIRouter(prefix="/api/v1", tags=["Profile"])

DEFAULT_USER_ID = 1


@router.get("/profile")
def get_profile(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()

    lessons_completed = db.query(UserLessonProgress).filter(
        UserLessonProgress.user_id == user.id,
        UserLessonProgress.completed == True
    ).count()

    skills_completed = db.query(UserSkillProgress).filter(
        UserSkillProgress.user_id == user.id,
        UserSkillProgress.completed == True
    ).count()

    return {
        "user": {
            "name": user.name,
            "xp": user.xp,
            "streak": user.streak
        },
        "stats": {
            "lessons_completed": lessons_completed,
            "skills_completed": skills_completed
        }
    }