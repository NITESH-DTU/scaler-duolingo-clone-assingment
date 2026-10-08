import json
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import DailyActivity, Exercise, Quest, User, UserExerciseProgress, UserQuestProgress
from routes.progress import update_achievements, update_daily_quests
from schemas import AnswerRequest

router = APIRouter(
    prefix="/api/v1/exercises",
    tags=["Exercises"],
)

DEFAULT_USER_ID = 1


@router.post("/{exercise_id}/answer")
def submit_answer(
    exercise_id: int,
    data: AnswerRequest,
    db: Session = Depends(get_db),
):
    exercise = (
        db.query(Exercise)
        .filter(Exercise.id == exercise_id)
        .first()
    )

    if not exercise:
        raise HTTPException(
            status_code=404,
            detail="Exercise not found",
        )

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

    if user.hearts <= 0:
        raise HTTPException(
            status_code=400,
            detail="No hearts remaining",
        )

    submitted_answer = data.answer.strip()

    if not submitted_answer:
        raise HTTPException(
            status_code=400,
            detail="Answer cannot be empty",
        )

    if exercise.type == "match":
        correct = validate_match_answer(
            exercise,
            submitted_answer,
        )
    else:
        correct = any(
            normalize_answer(submitted_answer)
            == normalize_answer(expected)
            for expected in parse_answer_values(exercise.answer)
        )

    if not correct:
        user.hearts = max(
            user.hearts - 1,
            0,
        )

    exercise_progress = (
        db.query(UserExerciseProgress)
        .filter(
            UserExerciseProgress.user_id == user.id,
            UserExerciseProgress.exercise_id == exercise.id,
        )
        .first()
    )
    is_first_attempt = exercise_progress is None
    if is_first_attempt:
        exercise_progress = UserExerciseProgress(
            user_id=user.id,
            exercise_id=exercise.id,
            xp_earned=0,
        )
        db.add(exercise_progress)

    xp_earned = 0
    if correct and exercise_progress.xp_earned == 0:
        lesson_exercises = sorted(exercise.lesson.exercises, key=lambda item: item.order)
        question_count = max(len(lesson_exercises), 1)
        base_xp, remainder = divmod(20, question_count)
        question_index = lesson_exercises.index(exercise)
        xp_earned = base_xp + (1 if question_index < remainder else 0)
        exercise_progress.xp_earned = xp_earned
        user.xp += xp_earned
        today = date.today()
        activity = (
            db.query(DailyActivity)
            .filter(DailyActivity.user_id == user.id, DailyActivity.date == today)
            .first()
        )
        if not activity:
            activity = DailyActivity(user_id=user.id, date=today, xp_earned=0)
            db.add(activity)
        activity.xp_earned += xp_earned
        update_daily_quests(db, user, today, xp_earned, lesson_completed=False)
        update_achievements(db, user)

    if is_first_attempt:
        update_exercise_quests(db, user)
    db.commit()

    response = {
        "correct": correct,
        "hearts_remaining": user.hearts,
        "xp_earned": xp_earned,
    }

    if not correct:
        response["correct_answer"] = ", ".join(
            parse_answer_values(exercise.answer)
        )

    return response


def validate_match_answer(
    exercise: Exercise,
    submitted_answer: str,
) -> bool:
    if not exercise.options:
        return False

    options = parse_string_list(exercise.options)

    if len(options) < 2 or len(options) % 2 != 0:
        return False

    expected_pairs = []

    for index in range(0, len(options), 2):
        left = options[index]
        right = options[index + 1]

        expected_pairs.append(
            (
                normalize_answer(left),
                normalize_answer(right),
            )
        )

    submitted_pairs = []

    for pair in submitted_answer.split("|"):
        pair = pair.strip()

        if "=" not in pair:
            return False

        left, right = pair.split("=", 1)

        submitted_pairs.append(
            (
                normalize_answer(left),
                normalize_answer(right),
            )
        )

    return (
        len(submitted_pairs) == len(expected_pairs)
        and set(submitted_pairs) == set(expected_pairs)
    )


def update_exercise_quests(db: Session, user: User) -> None:
    today = date.today()
    quests = (
        db.query(Quest)
        .filter(
            Quest.active == True,
            Quest.period == "daily",
            Quest.quest_type.in_(["exercises", "exercise_count"]),
        )
        .all()
    )

    for quest in quests:
        progress = (
            db.query(UserQuestProgress)
            .filter(
                UserQuestProgress.user_id == user.id,
                UserQuestProgress.quest_id == quest.id,
                UserQuestProgress.date == today,
            )
            .first()
        )
        if not progress:
            progress = UserQuestProgress(
                user_id=user.id,
                quest_id=quest.id,
                date=today,
                progress=0,
                completed=False,
            )
            db.add(progress)
            db.flush()

        if progress.completed:
            continue

        progress.progress = min(progress.progress + 1, quest.target)
        if progress.progress >= quest.target:
            progress.completed = True
            user.gems += quest.reward_gems


def normalize_answer(value: str) -> str:
    return " ".join(
        value.lower()
        .strip()
        .split()
    )


def parse_answer_values(value: str | None) -> list[str]:
    if not value:
        return []

    try:
        parsed = json.loads(value)
        if isinstance(parsed, list):
            return [item for item in parsed if isinstance(item, str) and item.strip()]
        if isinstance(parsed, str) and parsed.strip():
            return [parsed]
    except (json.JSONDecodeError, TypeError):
        pass

    # Older seeded data uses plain answer strings.
    return [value.strip().strip("\"'")]


def parse_string_list(value: str | None) -> list[str]:
    if not value:
        return []

    try:
        parsed = json.loads(value)
        if isinstance(parsed, list):
            return [item.strip() for item in parsed if isinstance(item, str) and item.strip()]
    except (json.JSONDecodeError, TypeError):
        pass

    return [item.strip().strip("\"'") for item in value.split(",") if item.strip()]
