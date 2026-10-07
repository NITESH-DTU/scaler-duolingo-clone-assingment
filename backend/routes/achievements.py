from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Achievement, UserAchievementProgress

router = APIRouter(
    prefix="/api/v1/achievements",
    tags=["Achievements"],
)

DEFAULT_USER_ID = 1


@router.get("")
def get_achievements(
    db: Session = Depends(get_db),
):
    achievements = (
        db.query(Achievement)
        .order_by(Achievement.id)
        .all()
    )

    result = []

    for achievement in achievements:
        progress = (
            db.query(UserAchievementProgress)
            .filter(
                UserAchievementProgress.user_id
                == DEFAULT_USER_ID,
                UserAchievementProgress.achievement_id
                == achievement.id,
            )
            .first()
        )

        current_progress = (
            progress.progress
            if progress
            else 0
        )

        completed = (
            progress.completed
            if progress
            else False
        )

        result.append(
            {
                "id": achievement.id,
                "title": achievement.title,
                "description": achievement.description,
                "icon": achievement.icon,
                "achievement_type": achievement.achievement_type,
                "target": achievement.target,
                "progress": current_progress,
                "completed": completed,
            }
        )

    return result