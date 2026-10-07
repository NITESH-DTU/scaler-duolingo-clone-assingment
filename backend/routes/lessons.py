from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Lesson

router = APIRouter(prefix="/api/v1/lessons", tags=["Lessons"])


@router.get("/{lesson_id}")
def get_lesson(
    lesson_id: int,
    db: Session = Depends(get_db)
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()

    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    exercises = sorted(lesson.exercises, key=lambda x: x.order)

    return {
        "id": lesson.id,
        "title": lesson.title,
        "skill_id": lesson.skill_id,
        "exercises": [
            {
                "id": exercise.id,
                "type": exercise.type,
                "question": exercise.question,
                "options": exercise.options,
                "order": exercise.order
            }
            for exercise in exercises
        ]
    }