from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import (
    Course,
    User,
    UserLessonProgress,
    UserSkillProgress,
)


router = APIRouter(
    prefix="/api/v1",
    tags=["Profile"],
)

DEFAULT_USER_ID = 1


@router.get("/profile")
def get_profile(
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.id == DEFAULT_USER_ID)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    lessons_completed = (
        db.query(UserLessonProgress)
        .filter(
            UserLessonProgress.user_id == user.id,
            UserLessonProgress.completed == True,
        )
        .count()
    )

    skills_completed = (
        db.query(UserSkillProgress)
        .filter(
            UserSkillProgress.user_id == user.id,
            UserSkillProgress.completed == True,
        )
        .count()
    )

    course = (
        db.query(Course)
        .first()
    )

    return {
        "user": {
            "name": user.name,
            "xp": user.xp,
            "streak": user.streak,
        },
        "course": {
            "name": course.name if course else None,
            "language": course.language if course else None,
        },
        "stats": {
            "lessons_completed": lessons_completed,
            "skills_completed": skills_completed,
        },
    }