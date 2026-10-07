from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Quest, UserQuestProgress

router = APIRouter(
    prefix="/api/v1/quests",
    tags=["Quests"],
)

DEFAULT_USER_ID = 1


@router.get("")
def get_quests(db: Session = Depends(get_db)):
    quests = (
        db.query(Quest)
        .filter(Quest.active == True)
        .all()
    )

    today = date.today()

    result = []

    for quest in quests:
        progress = (
            db.query(UserQuestProgress)
            .filter(
                UserQuestProgress.user_id == DEFAULT_USER_ID,
                UserQuestProgress.quest_id == quest.id,
            )
            .order_by(
                UserQuestProgress.date.desc()
            )
            .first()
        )

        current_progress = 0
        completed = False

        if progress:
            if quest.period == "daily":
                if progress.date == today:
                    current_progress = progress.progress
                    completed = progress.completed
            else:
                current_progress = progress.progress
                completed = progress.completed

        result.append(
            {
                "id": quest.id,
                "title": quest.title,
                "description": quest.description,
                "icon": quest.icon,
                "quest_type": quest.quest_type,
                "period": quest.period,
                "target": quest.target,
                "progress": current_progress,
                "completed": completed,
                "reward_gems": quest.reward_gems,
            }
        )

    return result