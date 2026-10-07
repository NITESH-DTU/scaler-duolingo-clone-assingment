from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    hearts = Column(Integer, default=5)
    gems = Column(Integer, default=100)

    last_activity = Column(Date, nullable=True)
    joined_at = Column(Date, nullable=True)

    skill_progress = relationship(
        "UserSkillProgress",
        back_populates="user"
    )

    lesson_progress = relationship(
        "UserLessonProgress",
        back_populates="user"
    )

    daily_activities = relationship(
        "DailyActivity",
        back_populates="user"
    )

    quest_progress = relationship(
        "UserQuestProgress",
        back_populates="user"
    )

    achievement_progress = relationship(
        "UserAchievementProgress",
        back_populates="user"
    )


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    language = Column(String, nullable=False)

    units = relationship(
        "Unit",
        back_populates="course"
    )


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True)
    course_id = Column(
        Integer,
        ForeignKey("courses.id"),
        nullable=False
    )

    title = Column(String, nullable=False)
    order = Column(Integer, nullable=False)

    course = relationship(
        "Course",
        back_populates="units"
    )

    skills = relationship(
        "Skill",
        back_populates="unit"
    )


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True)
    unit_id = Column(
        Integer,
        ForeignKey("units.id"),
        nullable=False
    )

    title = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
    xp_reward = Column(Integer, default=20)

    unit = relationship(
        "Unit",
        back_populates="skills"
    )

    lessons = relationship(
        "Lesson",
        back_populates="skill"
    )

    user_progress = relationship(
        "UserSkillProgress",
        back_populates="skill"
    )


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True)
    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
        nullable=False
    )

    title = Column(String, nullable=False)
    order = Column(Integer, nullable=False)

    skill = relationship(
        "Skill",
        back_populates="lessons"
    )

    exercises = relationship(
        "Exercise",
        back_populates="lesson"
    )

    user_progress = relationship(
        "UserLessonProgress",
        back_populates="lesson"
    )


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True)
    lesson_id = Column(
        Integer,
        ForeignKey("lessons.id"),
        nullable=False
    )

    type = Column(String, nullable=False)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)
    options = Column(String, nullable=True)
    order = Column(Integer, nullable=False)

    lesson = relationship(
        "Lesson",
        back_populates="exercises"
    )


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
        nullable=False
    )

    progress = Column(Integer, default=0)
    crowns = Column(Integer, default=0)
    completed = Column(Boolean, default=False)

    user = relationship(
        "User",
        back_populates="skill_progress"
    )

    skill = relationship(
        "Skill",
        back_populates="user_progress"
    )


class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    lesson_id = Column(
        Integer,
        ForeignKey("lessons.id"),
        nullable=False
    )

    completed = Column(Boolean, default=False)

    user = relationship(
        "User",
        back_populates="lesson_progress"
    )

    lesson = relationship(
        "Lesson",
        back_populates="user_progress"
    )


class DailyActivity(Base):
    __tablename__ = "daily_activities"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    date = Column(Date, nullable=False)
    xp_earned = Column(Integer, default=0)

    user = relationship(
        "User",
        back_populates="daily_activities"
    )


# ---------------------------------------------------------
# QUESTS
# ---------------------------------------------------------

class Quest(Base):
    __tablename__ = "quests"

    id = Column(Integer, primary_key=True)

    title = Column(String, nullable=False)
    description = Column(String, nullable=False)

    icon = Column(String, nullable=False)

    # earn_xp
    # complete_lessons
    # correct_streak
    quest_type = Column(String, nullable=False)

    # daily / monthly
    period = Column(String, nullable=False)

    target = Column(Integer, nullable=False)
    reward_gems = Column(Integer, default=0)

    active = Column(Boolean, default=True)

    progress = relationship(
        "UserQuestProgress",
        back_populates="quest"
    )


class UserQuestProgress(Base):
    __tablename__ = "user_quest_progress"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    quest_id = Column(
        Integer,
        ForeignKey("quests.id"),
        nullable=False
    )

    date = Column(Date, nullable=False)

    progress = Column(Integer, default=0)
    completed = Column(Boolean, default=False)

    user = relationship(
        "User",
        back_populates="quest_progress"
    )

    quest = relationship(
        "Quest",
        back_populates="progress"
    )


# ---------------------------------------------------------
# ACHIEVEMENTS
# ---------------------------------------------------------

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True)

    title = Column(String, nullable=False)
    description = Column(String, nullable=False)

    icon = Column(String, nullable=False)

    # streak
    # xp
    # lessons
    achievement_type = Column(String, nullable=False)

    target = Column(Integer, nullable=False)

    progress = relationship(
        "UserAchievementProgress",
        back_populates="achievement"
    )


class UserAchievementProgress(Base):
    __tablename__ = "user_achievement_progress"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    achievement_id = Column(
        Integer,
        ForeignKey("achievements.id"),
        nullable=False
    )

    progress = Column(Integer, default=0)
    completed = Column(Boolean, default=False)

    user = relationship(
        "User",
        back_populates="achievement_progress"
    )

    achievement = relationship(
        "Achievement",
        back_populates="progress"
    )


# ---------------------------------------------------------
# SETTINGS
# ---------------------------------------------------------

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    sound_enabled = Column(Boolean, default=True)
    music_enabled = Column(Boolean, default=True)
    notifications_enabled = Column(Boolean, default=True)

    user = relationship("User")