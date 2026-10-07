from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Exercise, User
from schemas import AnswerRequest

router = APIRouter(
    prefix="/api/v1/exercises",
    tags=["Exercises"]
)

DEFAULT_USER_ID = 1


@router.post("/{exercise_id}/answer")
def submit_answer(
    exercise_id: int,
    data: AnswerRequest,
    db: Session = Depends(get_db)
):
    exercise = db.query(Exercise).filter(
        Exercise.id == exercise_id
    ).first()

    if not exercise:
        raise HTTPException(
            status_code=404,
            detail="Exercise not found"
        )

    user = db.query(User).filter(
        User.id == DEFAULT_USER_ID
    ).first()

    if user.hearts <= 0:
        raise HTTPException(
            status_code=400,
            detail="No hearts remaining"
        )

    correct = (
        data.answer.strip().lower()
        == exercise.answer.strip().lower()
    )

    if not correct:
        user.hearts -= 1

    db.commit()

    response = {
        "correct": correct,
        "hearts_remaining": user.hearts
    }

    if not correct:
        response["correct_answer"] = exercise.answer

    return response