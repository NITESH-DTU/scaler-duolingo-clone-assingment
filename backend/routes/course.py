from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Course, UserSkillProgress

router = APIRouter(prefix="/api/v1/course", tags=["Course"])

DEFAULT_USER_ID = 1


@router.get("/path")
def get_learning_path(db: Session = Depends(get_db)):
    course = db.query(Course).first()

    units = sorted(course.units, key=lambda x: x.order)

    all_skills = []

    for unit in units:
        for skill in sorted(unit.skills, key=lambda x: x.order):
            all_skills.append(skill)

    progress_map = {
        progress.skill_id: progress
        for progress in db.query(UserSkillProgress)
        .filter(UserSkillProgress.user_id == DEFAULT_USER_ID)
        .all()
    }

    result_units = []

    for unit in units:
        result_skills = []

        for skill in sorted(unit.skills, key=lambda x: x.order):
            progress = progress_map.get(skill.id)

            skill_index = all_skills.index(skill)

            if progress and progress.completed:
                status = "completed"
            elif skill_index == 0:
                status = "available"
            else:
                previous_skill = all_skills[skill_index - 1]
                previous_progress = progress_map.get(previous_skill.id)

                if previous_progress and previous_progress.completed:
                    status = "available"
                else:
                    status = "locked"

            result_skills.append({
    "id": skill.id,
    "title": skill.title,
    "status": status,
    "progress": progress.progress if progress else 0,
    "crowns": progress.crowns if progress else 0,
    "xp_reward": skill.xp_reward,
    "lesson_id": skill.lessons[0].id if skill.lessons else None,
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