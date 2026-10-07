from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Exercise, User
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
        correct = (
            normalize_answer(submitted_answer)
            == normalize_answer(exercise.answer)
        )

    if not correct:
        user.hearts = max(
            user.hearts - 1,
            0,
        )

        db.commit()

    response = {
        "correct": correct,
        "hearts_remaining": user.hearts,
    }

    if not correct:
        response["correct_answer"] = exercise.answer

    return response


def validate_match_answer(
    exercise: Exercise,
    submitted_answer: str,
) -> bool:
    if not exercise.options:
        return False

    options = [
        option.strip()
        for option in exercise.options.split(",")
        if option.strip()
    ]

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


def normalize_answer(value: str) -> str:
    return " ".join(
        value.lower()
        .strip()
        .split()
    )