from calendar import monthrange
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
def get_quests(
    db: Session = Depends(get_db),
):
    quests = (
        db.query(Quest)
        .filter(Quest.active == True)
        .order_by(
            Quest.period,
            Quest.id,
        )
        .all()
    )

    today = date.today()

    result = []

    for quest in quests:
        if quest.period == "daily":
            progress_date = today

            progress = get_progress(
                db=db,
                quest_id=quest.id,
                progress_date=progress_date,
            )

        else:
            progress = get_monthly_progress(
                db=db,
                quest_id=quest.id,
                today=today,
                quest_type=quest.quest_type,
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


def get_progress(
    db: Session,
    quest_id: int,
    progress_date: date,
):
    return (
        db.query(UserQuestProgress)
        .filter(
            UserQuestProgress.user_id
            == DEFAULT_USER_ID,
            UserQuestProgress.quest_id
            == quest_id,
            UserQuestProgress.date
            == progress_date,
        )
        .first()
    )


def get_monthly_progress(
    db: Session,
    quest_id: int,
    today: date,
    quest_type: str,
):
    month_start = today.replace(day=1)

    last_day = monthrange(
        today.year,
        today.month,
    )[1]

    month_end = today.replace(
        day=last_day
    )

    return (
        db.query(UserQuestProgress)
        .filter(
            UserQuestProgress.user_id
            == DEFAULT_USER_ID,
            UserQuestProgress.quest_id
            == quest_id,
            UserQuestProgress.date
            >= month_start,
            UserQuestProgress.date
            <= month_end,
        )
        .order_by(
            UserQuestProgress.date.asc()
            if quest_type == "lessons"
            else UserQuestProgress.date.desc()
        )
        .first()
    )
