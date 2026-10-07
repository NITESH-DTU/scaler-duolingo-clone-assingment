from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import (
    Course,
    UserLessonProgress,
    UserSkillProgress,
)

router = APIRouter(
    prefix="/api/v1/course",
    tags=["Course"],
)

DEFAULT_USER_ID = 1


@router.get("/path")
def get_learning_path(
    db: Session = Depends(get_db),
):
    course = db.query(Course).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found",
        )

    units = sorted(
        course.units,
        key=lambda unit: unit.order,
    )

    all_skills = []

    for unit in units:
        for skill in sorted(
            unit.skills,
            key=lambda skill: skill.order,
        ):
            all_skills.append(skill)

    skill_progress_map = {
        progress.skill_id: progress
        for progress in (
            db.query(UserSkillProgress)
            .filter(
                UserSkillProgress.user_id
                == DEFAULT_USER_ID
            )
            .all()
        )
    }

    lesson_progress = (
        db.query(UserLessonProgress)
        .filter(
            UserLessonProgress.user_id
            == DEFAULT_USER_ID
        )
        .all()
    )

    completed_lesson_ids = {
        progress.lesson_id
        for progress in lesson_progress
        if progress.completed
    }

    skill_completed_map = {}

    for skill in all_skills:
        lessons = list(skill.lessons)

        if not lessons:
            skill_completed_map[skill.id] = False
            continue

        skill_completed_map[skill.id] = all(
            lesson.id in completed_lesson_ids
            for lesson in lessons
        )

    result_units = []

    for unit in units:
        result_skills = []

        for skill in sorted(
            unit.skills,
            key=lambda skill: skill.order,
        ):
            progress = skill_progress_map.get(
                skill.id
            )

            skill_index = all_skills.index(skill)

            is_completed = skill_completed_map.get(
                skill.id,
                False,
            )

            if is_completed:
                status = "completed"

            elif skill_index == 0:
                status = "available"

            else:
                previous_skill = all_skills[
                    skill_index - 1
                ]

                previous_completed = (
                    skill_completed_map.get(
                        previous_skill.id,
                        False,
                    )
                )

                if previous_completed:
                    status = "available"
                else:
                    status = "locked"

            result_skills.append({
                "id": skill.id,
                "title": skill.title,
                "status": status,
                "progress": (
                    progress.progress
                    if progress
                    else 0
                ),
                "crowns": (
                    progress.crowns
                    if progress
                    else 0
                ),
                "xp_reward": skill.xp_reward,
                "lesson_id": (
                    skill.lessons[0].id
                    if skill.lessons
                    else None
                ),
            })

        result_units.append({
            "id": unit.id,
            "title": unit.title,
            "order": unit.order,
            "skills": result_skills,
        })

    return {
        "course": {
            "id": course.id,
            "name": course.name,
            "language": course.language,
        },
        "units": result_units,
    }