from datetime import date

from database import Base, SessionLocal, engine
from models import (
    Achievement,
    Course,
    DailyActivity,
    Exercise,
    Lesson,
    Quest,
    Skill,
    Unit,
    User,
    UserAchievementProgress,
    UserLessonProgress,
    UserQuestProgress,
    UserSettings,
    UserSkillProgress,
)


# ---------------------------------------------------------
# RESET DATABASE
# ---------------------------------------------------------

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()


# ---------------------------------------------------------
# USER
# ---------------------------------------------------------

user = User(
    id=1,
    name="Nitesh",
    xp=0,
    streak=0,
    hearts=5,
    gems=100,
    last_activity=None,
)

db.add(user)
db.flush()


# ---------------------------------------------------------
# COURSE
# ---------------------------------------------------------

course = Course(
    name="Spanish",
    language="Spanish",
)

db.add(course)
db.flush()


# ---------------------------------------------------------
# UNIT
# ---------------------------------------------------------

unit = Unit(
    course_id=course.id,
    title="Basics",
    order=1,
)

db.add(unit)
db.flush()


# ---------------------------------------------------------
# SKILLS + LESSONS + EXERCISES
# ---------------------------------------------------------

skills_data = [
    {
        "title": "Greetings",
        "order": 1,
        "lesson_title": "Basic Greetings",
        "exercises": [
            {
                "type": "multiple_choice",
                "question": "What does 'Hola' mean?",
                "answer": "Hello",
                "options": "Hello,Goodbye,Thanks,Please",
            },
            {
                "type": "translate",
                "question": "Translate: Hello",
                "answer": "Hola",
                "options": None,
            },
            {
                "type": "fill_blank",
                "question": "___ días",
                "answer": "Buenos",
                "options": None,
            },
            {
                "type": "type_answer",
                "question": "Type the Spanish word for 'Goodbye'",
                "answer": "Adios",
                "options": None,
            },
            {
                "type": "match",
                "question": "Match the words with their meanings",
                "answer": "Hola",
                "options": "Hola,Hello,Gracias,Thanks,Adios,Goodbye",
            },
        ],
    },
    {
        "title": "Food",
        "order": 2,
        "lesson_title": "Food Basics",
        "exercises": [
            {
                "type": "multiple_choice",
                "question": "What does 'pan' mean?",
                "answer": "Bread",
                "options": "Bread,Water,Milk,Apple",
            },
            {
                "type": "translate",
                "question": "Translate: I eat bread",
                "answer": "Yo como pan",
                "options": None,
            },
            {
                "type": "fill_blank",
                "question": "Yo ___ pan",
                "answer": "como",
                "options": None,
            },
            {
                "type": "type_answer",
                "question": "Type the Spanish word for 'Water'",
                "answer": "Agua",
                "options": None,
            },
            {
                "type": "match",
                "question": "Match the food words",
                "answer": "Pan",
                "options": "Pan,Bread,Agua,Water,Leche,Milk",
            },
        ],
    },
    {
        "title": "Family",
        "order": 3,
        "lesson_title": "Family Basics",
        "exercises": [
            {
                "type": "multiple_choice",
                "question": "What does 'madre' mean?",
                "answer": "Mother",
                "options": "Mother,Father,Sister,Brother",
            },
            {
                "type": "multiple_choice",
                "question": "What does 'padre' mean?",
                "answer": "Father",
                "options": "Mother,Father,Sister,Brother",
            },
            {
                "type": "type_answer",
                "question": "Type the Spanish word for 'Mother'",
                "answer": "Madre",
                "options": None,
            },
            {
                "type": "fill_blank",
                "question": "Mi ___ es amable",
                "answer": "madre",
                "options": None,
            },
            {
                "type": "match",
                "question": "Match the family words",
                "answer": "Madre",
                "options": "Madre,Mother,Padre,Father,Hermano,Brother",
            },
        ],
    },
]


for skill_data in skills_data:
    skill = Skill(
        unit_id=unit.id,
        title=skill_data["title"],
        order=skill_data["order"],
        xp_reward=20,
    )

    db.add(skill)
    db.flush()

    lesson = Lesson(
        skill_id=skill.id,
        title=skill_data["lesson_title"],
        order=1,
    )

    db.add(lesson)
    db.flush()

    for index, exercise_data in enumerate(
        skill_data["exercises"],
        start=1,
    ):
        exercise = Exercise(
            lesson_id=lesson.id,
            type=exercise_data["type"],
            question=exercise_data["question"],
            answer=exercise_data["answer"],
            options=exercise_data["options"],
            order=index,
        )

        db.add(exercise)

    db.add(
        UserSkillProgress(
            user_id=user.id,
            skill_id=skill.id,
            progress=0,
            crowns=0,
            completed=False,
        )
    )

    db.add(
        UserLessonProgress(
            user_id=user.id,
            lesson_id=lesson.id,
            completed=False,
        )
    )


# ---------------------------------------------------------
# DAILY QUESTS
# ---------------------------------------------------------

daily_quests = [
    Quest(
        title="Earn 20 XP",
        description="Complete lessons to earn 20 XP.",
        icon="⚡",
        quest_type="earn_xp",
        period="daily",
        target=20,
        reward_gems=5,
        active=True,
    ),
    Quest(
        title="Spend 10 minutes learning",
        description="Keep learning for 10 minutes.",
        icon="⏱️",
        quest_type="learning_minutes",
        period="daily",
        target=10,
        reward_gems=5,
        active=True,
    ),
    Quest(
        title="Earn 15 Combo Bonus XP",
        description="Build your combo and earn bonus XP.",
        icon="⚡",
        quest_type="combo_xp",
        period="daily",
        target=15,
        reward_gems=10,
        active=True,
    ),
]

for quest in daily_quests:
    db.add(quest)

db.flush()


# ---------------------------------------------------------
# MONTHLY QUEST
# ---------------------------------------------------------

monthly_quest = Quest(
    title="Complete 20 quests",
    description="Complete quests throughout the month.",
    icon="🏆",
    quest_type="complete_quests",
    period="monthly",
    target=20,
    reward_gems=50,
    active=True,
)

db.add(monthly_quest)
db.flush()


# ---------------------------------------------------------
# USER QUEST PROGRESS
# ---------------------------------------------------------

today = date.today()

for quest in daily_quests:
    db.add(
        UserQuestProgress(
            user_id=user.id,
            quest_id=quest.id,
            date=today,
            progress=0,
            completed=False,
        )
    )

db.add(
    UserQuestProgress(
        user_id=user.id,
        quest_id=monthly_quest.id,
        date=today,
        progress=0,
        completed=False,
    )
)


# ---------------------------------------------------------
# ACHIEVEMENTS
# ---------------------------------------------------------

achievements = [
    Achievement(
        title="Wildfire",
        description="Reach a 3 day streak",
        icon="🔥",
        achievement_type="streak",
        target=3,
    ),
    Achievement(
        title="Sage",
        description="Earn 100 XP",
        icon="🧙",
        achievement_type="xp",
        target=100,
    ),
    Achievement(
        title="Scholar",
        description="Complete 3 lessons",
        icon="⭐",
        achievement_type="lessons",
        target=3,
    ),
]

for achievement in achievements:
    db.add(achievement)

db.flush()


# ---------------------------------------------------------
# USER ACHIEVEMENT PROGRESS
# ---------------------------------------------------------

for achievement in achievements:
    db.add(
        UserAchievementProgress(
            user_id=user.id,
            achievement_id=achievement.id,
            progress=0,
            completed=False,
        )
    )


# ---------------------------------------------------------
# SETTINGS
# ---------------------------------------------------------

db.add(
    UserSettings(
        user_id=user.id,
        sound_enabled=True,
        music_enabled=True,
        notifications_enabled=True,
    )
)


# ---------------------------------------------------------
# DAILY ACTIVITY
# ---------------------------------------------------------

db.add(
    DailyActivity(
        user_id=user.id,
        date=today,
        xp_earned=0,
    )
)


# ---------------------------------------------------------
# COMMIT
# ---------------------------------------------------------

db.commit()
db.close()

print("Database seeded successfully.")
print("User: Nitesh")
print("Course: Spanish")
print("Skills: 3")
print("Lessons: 3")
print("Exercises: 15")
print("Daily quests: 3")
print("Monthly quests: 1")
print("Achievements: 3")