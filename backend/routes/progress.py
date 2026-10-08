from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from models import (
    Achievement,
    DailyActivity,
    Exercise,
    Lesson,
    Quest,
    Skill,
    User,
    UserAchievementProgress,
    UserLessonProgress,
    UserExerciseProgress,
    UserQuestProgress,
    UserSkillProgress,
)

router = APIRouter(
    prefix="/api/v1/lessons",
    tags=["Progress"],
)

DEFAULT_USER_ID = 1
MAX_HEARTS = 5


@router.post("/{lesson_id}/complete")
def complete_lesson(
    lesson_id: int,
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

    lesson = (
        db.query(Lesson)
        .filter(Lesson.id == lesson_id)
        .first()
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found",
        )

    if user.hearts <= 0:
        raise HTTPException(
            status_code=400,
            detail="No hearts remaining",
        )

    lesson_progress = (
        db.query(UserLessonProgress)
        .filter(
            UserLessonProgress.user_id == user.id,
            UserLessonProgress.lesson_id == lesson.id,
        )
        .first()
    )

    if not lesson_progress:
        lesson_progress = UserLessonProgress(
            user_id=user.id,
            lesson_id=lesson.id,
            completed=False,
        )

        db.add(lesson_progress)
        db.flush()

    if lesson_progress.completed:
        skill_progress = (
            db.query(UserSkillProgress)
            .filter(
                UserSkillProgress.user_id == user.id,
                UserSkillProgress.skill_id == lesson.skill_id,
            )
            .first()
        )

        return {
            "message": "Lesson already completed",
            "xp_earned": 0,
            "total_xp": user.xp,
            "streak": user.streak,
            "daily_xp": get_daily_xp(
                db,
                user.id,
                date.today(),
            ),
            "skill_progress": (
                skill_progress.progress
                if skill_progress
                else 0
            ),
        }

    skill = (
        db.query(Skill)
        .filter(Skill.id == lesson.skill_id)
        .first()
    )

    if not skill:
        raise HTTPException(
            status_code=404,
            detail="Skill not found",
        )

    today = date.today()

    lesson_progress.completed = True

    skill_progress = (
        db.query(UserSkillProgress)
        .filter(
            UserSkillProgress.user_id == user.id,
            UserSkillProgress.skill_id == skill.id,
        )
        .first()
    )

    if not skill_progress:
        skill_progress = UserSkillProgress(
            user_id=user.id,
            skill_id=skill.id,
            progress=0,
            crowns=0,
            completed=False,
        )

        db.add(skill_progress)
        db.flush()

    db.flush()
    skill_lesson_ids = [lesson_item.id for lesson_item in skill.lessons]
    completed_skill_lessons = (
        db.query(UserLessonProgress)
        .filter(
            UserLessonProgress.user_id == user.id,
            UserLessonProgress.lesson_id.in_(skill_lesson_ids),
            UserLessonProgress.completed == True,
        )
        .count()
    )
    skill_progress.progress = round(
        completed_skill_lessons / max(len(skill_lesson_ids), 1) * 100
    )

    if skill_progress.progress >= 100:
        if not skill_progress.completed:
            skill_progress.crowns = min(
                skill_progress.crowns + 1,
                5,
            )

        skill_progress.completed = True

    xp_already_earned = (
        db.query(func.coalesce(func.sum(UserExerciseProgress.xp_earned), 0))
        .join(Exercise, UserExerciseProgress.exercise_id == Exercise.id)
        .filter(
            UserExerciseProgress.user_id == user.id,
            Exercise.lesson_id == lesson.id,
        )
        .scalar()
    )
    xp_earned = max(20 - xp_already_earned, 0)

    user.xp += xp_earned

    activity = (
        db.query(DailyActivity)
        .filter(
            DailyActivity.user_id == user.id,
            DailyActivity.date == today,
        )
        .first()
    )

    if not activity:
        activity = DailyActivity(
            user_id=user.id,
            date=today,
            xp_earned=0,
        )

        db.add(activity)
        db.flush()

    activity.xp_earned += xp_earned

    update_streak(
        user=user,
        today=today,
    )

    update_daily_quests(
        db=db,
        user=user,
        today=today,
        xp_earned=xp_earned,
        lesson_completed=True,
    )

    update_monthly_quest(
        db=db,
        user=user,
        today=today,
    )

    update_achievements(
        db=db,
        user=user,
    )

    db.commit()

    return {
        "message": "Lesson completed",
        "xp_earned": xp_earned,
        "total_xp": user.xp,
        "streak": user.streak,
        "daily_xp": get_daily_xp(
            db,
            user.id,
            today,
        ),
        "skill_progress": skill_progress.progress,
    }


def update_streak(
    user: User,
    today: date,
):
    if user.last_activity is None:
        user.streak = 1

    elif user.last_activity == today:
        pass

    elif user.last_activity == today - timedelta(days=1):
        user.streak += 1

    elif user.last_activity == today - timedelta(days=2):
        if user.streak_freezes > 0:
            user.streak_freezes -= 1
            user.streak += 2
        else:
            user.streak = 1

    else:
        user.streak = 1

    user.last_activity = today


def update_daily_quests(
    db: Session,
    user: User,
    today: date,
    xp_earned: int,
    lesson_completed: bool = True,
):
    quests = (
        db.query(Quest)
        .filter(
            Quest.active == True,
            Quest.period == "daily",
        )
        .all()
    )

    for quest in quests:
        progress = get_or_create_quest_progress(
            db=db,
            user_id=user.id,
            quest_id=quest.id,
            today=today,
        )

        if progress.completed:
            continue

        if quest.quest_type in {"earn_xp", "xp"}:
            progress.progress += xp_earned

        elif quest.quest_type in {"complete_lessons", "lessons"}:
            if lesson_completed:
                progress.progress += 1

        elif quest.quest_type == "combo_xp":
            progress.progress += min(
                xp_earned,
                5,
            )

        elif quest.quest_type == "learning_minutes":
            progress.progress += 1

        progress.progress = min(
            progress.progress,
            quest.target,
        )

        if progress.progress >= quest.target:
            progress.completed = True
            user.gems += quest.reward_gems


def update_monthly_quest(
    db: Session,
    user: User,
    today: date,
):
    quest = (
        db.query(Quest)
        .filter(
            Quest.active == True,
            Quest.period == "monthly",
            Quest.quest_type.in_(["complete_quests", "lessons"]),
        )
        .first()
    )

    if not quest:
        return

    month_start = today.replace(day=1)
    progress_date = month_start if quest.quest_type == "lessons" else today
    progress = get_or_create_quest_progress(
        db=db,
        user_id=user.id,
        quest_id=quest.id,
        today=progress_date,
    )

    if progress.completed:
        return

    if quest.quest_type == "lessons":
        progress.progress = min(progress.progress + 1, quest.target)
    else:
        completed_daily_quests = (
            db.query(UserQuestProgress)
            .join(
                Quest,
                UserQuestProgress.quest_id == Quest.id,
            )
            .filter(
                UserQuestProgress.user_id == user.id,
                UserQuestProgress.completed == True,
                Quest.period == "daily",
                UserQuestProgress.date >= month_start,
                UserQuestProgress.date <= today,
            )
            .count()
        )

        progress.progress = min(
            completed_daily_quests,
            quest.target,
        )

    if progress.progress >= quest.target:
        progress.completed = True
        user.gems += quest.reward_gems


def get_or_create_quest_progress(
    db: Session,
    user_id: int,
    quest_id: int,
    today: date,
):
    progress = (
        db.query(UserQuestProgress)
        .filter(
            UserQuestProgress.user_id == user_id,
            UserQuestProgress.quest_id == quest_id,
            UserQuestProgress.date == today,
        )
        .first()
    )

    if not progress:
        progress = UserQuestProgress(
            user_id=user_id,
            quest_id=quest_id,
            date=today,
            progress=0,
            completed=False,
        )

        db.add(progress)
        db.flush()

    return progress


def update_achievements(
    db: Session,
    user: User,
):
    achievements = (
        db.query(Achievement)
        .order_by(Achievement.id)
        .all()
    )

    completed_lessons = (
        db.query(UserLessonProgress)
        .filter(
            UserLessonProgress.user_id == user.id,
            UserLessonProgress.completed == True,
        )
        .count()
    )

    for achievement in achievements:
        progress = (
            db.query(UserAchievementProgress)
            .filter(
                UserAchievementProgress.user_id == user.id,
                UserAchievementProgress.achievement_id
                == achievement.id,
            )
            .first()
        )

        if not progress:
            progress = UserAchievementProgress(
                user_id=user.id,
                achievement_id=achievement.id,
                progress=0,
                completed=False,
            )

            db.add(progress)
            db.flush()

        if progress.completed:
            continue

        if achievement.achievement_type == "streak":
            progress.progress = user.streak

        elif achievement.achievement_type == "xp":
            progress.progress = user.xp

        elif achievement.achievement_type == "lessons":
            progress.progress = completed_lessons

        progress.progress = min(
            progress.progress,
            achievement.target,
        )

        if progress.progress >= achievement.target:
            progress.completed = True


def get_daily_xp(
    db: Session,
    user_id: int,
    today: date,
) -> int:
    activity = (
        db.query(DailyActivity)
        .filter(
            DailyActivity.user_id == user_id,
            DailyActivity.date == today,
        )
        .first()
    )

    if not activity:
        return 0

    return activity.xp_earned
