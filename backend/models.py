from sqlalchemy import (
    Boolean,
    Column,
    Date,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    xp = Column(Integer, default=0, nullable=False)
    streak = Column(Integer, default=0, nullable=False)
    hearts = Column(Integer, default=5, nullable=False)
    gems = Column(Integer, default=100, nullable=False)
    streak_freezes = Column(Integer, default=0, nullable=False)

    last_activity = Column(Date, nullable=True)
    joined_at = Column(Date, nullable=True)

    skill_progress = relationship(
        "UserSkillProgress",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    lesson_progress = relationship(
        "UserLessonProgress",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    daily_activities = relationship(
        "DailyActivity",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    quest_progress = relationship(
        "UserQuestProgress",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    achievement_progress = relationship(
        "UserAchievementProgress",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    settings = relationship(
        "UserSettings",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    language = Column(String, nullable=False)

    units = relationship(
        "Unit",
        back_populates="course",
        cascade="all, delete-orphan",
        order_by="Unit.order",
    )


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True)

    course_id = Column(
        Integer,
        ForeignKey("courses.id"),
        nullable=False,
        index=True,
    )

    title = Column(String, nullable=False)
    order = Column(Integer, nullable=False)

    course = relationship(
        "Course",
        back_populates="units",
    )

    skills = relationship(
        "Skill",
        back_populates="unit",
        cascade="all, delete-orphan",
        order_by="Skill.order",
    )


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True)

    unit_id = Column(
        Integer,
        ForeignKey("units.id"),
        nullable=False,
        index=True,
    )

    title = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
    xp_reward = Column(Integer, default=20, nullable=False)

    unit = relationship(
        "Unit",
        back_populates="skills",
    )

    lessons = relationship(
        "Lesson",
        back_populates="skill",
        cascade="all, delete-orphan",
        order_by="Lesson.order",
    )

    user_progress = relationship(
        "UserSkillProgress",
        back_populates="skill",
        cascade="all, delete-orphan",
    )


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True)

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
        nullable=False,
        index=True,
    )

    title = Column(String, nullable=False)
    order = Column(Integer, nullable=False)

    skill = relationship(
        "Skill",
        back_populates="lessons",
    )

    exercises = relationship(
        "Exercise",
        back_populates="lesson",
        cascade="all, delete-orphan",
        order_by="Exercise.order",
    )

    user_progress = relationship(
        "UserLessonProgress",
        back_populates="lesson",
        cascade="all, delete-orphan",
    )


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True)

    lesson_id = Column(
        Integer,
        ForeignKey("lessons.id"),
        nullable=False,
        index=True,
    )

    type = Column(String, nullable=False)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)
    options = Column(String, nullable=True)
    order = Column(Integer, nullable=False)

    lesson = relationship(
        "Lesson",
        back_populates="exercises",
    )


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
        nullable=False,
        index=True,
    )

    progress = Column(Integer, default=0, nullable=False)
    crowns = Column(Integer, default=0, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "skill_id",
            name="uq_user_skill_progress",
        ),
    )

    user = relationship(
        "User",
        back_populates="skill_progress",
    )

    skill = relationship(
        "Skill",
        back_populates="user_progress",
    )


class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    lesson_id = Column(
        Integer,
        ForeignKey("lessons.id"),
        nullable=False,
        index=True,
    )

    completed = Column(Boolean, default=False, nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "lesson_id",
            name="uq_user_lesson_progress",
        ),
    )

    user = relationship(
        "User",
        back_populates="lesson_progress",
    )

    lesson = relationship(
        "Lesson",
        back_populates="user_progress",
    )


class DailyActivity(Base):
    __tablename__ = "daily_activities"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    date = Column(Date, nullable=False)
    xp_earned = Column(Integer, default=0, nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "date",
            name="uq_user_daily_activity",
        ),
    )

    user = relationship(
        "User",
        back_populates="daily_activities",
    )


class Quest(Base):
    __tablename__ = "quests"

    id = Column(Integer, primary_key=True)

    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    icon = Column(String, nullable=False)

    quest_type = Column(String, nullable=False)
    period = Column(String, nullable=False)

    target = Column(Integer, nullable=False)
    reward_gems = Column(Integer, default=0, nullable=False)

    active = Column(Boolean, default=True, nullable=False)

    progress = relationship(
        "UserQuestProgress",
        back_populates="quest",
        cascade="all, delete-orphan",
    )


class UserQuestProgress(Base):
    __tablename__ = "user_quest_progress"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    quest_id = Column(
        Integer,
        ForeignKey("quests.id"),
        nullable=False,
        index=True,
    )

    date = Column(Date, nullable=False)

    progress = Column(Integer, default=0, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "quest_id",
            "date",
            name="uq_user_quest_date",
        ),
    )

    user = relationship(
        "User",
        back_populates="quest_progress",
    )

    quest = relationship(
        "Quest",
        back_populates="progress",
    )


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True)

    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    icon = Column(String, nullable=False)

    achievement_type = Column(String, nullable=False)
    target = Column(Integer, nullable=False)

    progress = relationship(
        "UserAchievementProgress",
        back_populates="achievement",
        cascade="all, delete-orphan",
    )


class UserAchievementProgress(Base):
    __tablename__ = "user_achievement_progress"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    achievement_id = Column(
        Integer,
        ForeignKey("achievements.id"),
        nullable=False,
        index=True,
    )

    progress = Column(Integer, default=0, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "achievement_id",
            name="uq_user_achievement_progress",
        ),
    )

    user = relationship(
        "User",
        back_populates="achievement_progress",
    )

    achievement = relationship(
        "Achievement",
        back_populates="progress",
    )


class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    sound_enabled = Column(Boolean, default=True, nullable=False)
    music_enabled = Column(Boolean, default=True, nullable=False)
    notifications_enabled = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            name="uq_user_settings",
        ),
    )

    user = relationship(
        "User",
        back_populates="settings",
    )