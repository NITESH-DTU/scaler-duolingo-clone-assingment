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
    skill_lesson_map = {}
    skill_lesson_count_map = {}

    for skill in all_skills:
        lessons = sorted(skill.lessons, key=lambda lesson: lesson.id)
        skill_lesson_map[skill.id] = lessons

        if not lessons:
            skill_completed_map[skill.id] = False
            skill_lesson_count_map[skill.id] = 0
            continue

        completed_count = sum(
            lesson.id in completed_lesson_ids
            for lesson in lessons
        )
        skill_lesson_count_map[skill.id] = completed_count
        skill_completed_map[skill.id] = completed_count == len(lessons)

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
            lessons = skill_lesson_map.get(skill.id, [])
            completed_count = skill_lesson_count_map.get(skill.id, 0)
            lesson_progress_percent = (
                round(completed_count / len(lessons) * 100)
                if lessons
                else 0
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
                "progress": lesson_progress_percent,
                "crowns": (
                    max(progress.crowns if progress else 0, 1 if is_completed else 0)
                ),
                "xp_reward": skill.xp_reward,
                "lesson_id": next(
                    (lesson.id for lesson in lessons if lesson.id not in completed_lesson_ids),
                    lessons[-1].id if lessons else None,
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
