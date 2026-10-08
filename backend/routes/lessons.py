import json
import random
import re

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
                "word_bank": (
                    build_word_bank(exercise.answer, exercise.id)
                    if exercise.type == "translate"
                    else None
                ),
                "order": exercise.order
            }
            for exercise in exercises
        ]
    }


def build_word_bank(answer: str, seed: int) -> list[str]:
    """Build a repeatable, shuffled word bank without returning the full answer."""
    try:
        parsed = json.loads(answer)
        phrase = next(
            (value for value in parsed if isinstance(value, str) and value.strip()),
            "",
        ) if isinstance(parsed, list) else parsed if isinstance(parsed, str) else answer
    except json.JSONDecodeError:
        phrase = answer

    tokens = re.findall(r"[^\W\d_]+(?:['’][^\W\d_]+)*|[.,!?¿¡]", phrase, re.UNICODE)
    answer_keys = {token.casefold() for token in tokens}
    distractors = [
        "hola", "gracias", "adiós", "buenos", "días", "por", "favor",
        "yo", "como", "pan", "agua", "me", "llamo", "hasta", "luego",
    ]
    available = [word for word in distractors if word.casefold() not in answer_keys]
    decoys = random.Random(seed).sample(available, min(3, len(available)))
    bank = tokens + decoys
    random.Random(seed + 1).shuffle(bank)
    return bank
