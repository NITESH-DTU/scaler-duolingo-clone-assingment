import argparse
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

parser = argparse.ArgumentParser(description="Seed the Duolingo demo database.")
parser.add_argument(
    "--reset",
    action="store_true",
    help="Delete existing tables and learner progress before reseeding.",
)
args = parser.parse_args()

if args.reset:
    Base.metadata.drop_all(bind=engine)

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ---------------------------------------------------------
# USER
# ---------------------------------------------------------

user = db.query(User).filter(User.id == 1).first()
if user is None:
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

# Seed a small, stable set of learners so the leaderboard is useful on first
# launch. Existing scores are left untouched if this script runs again.
seeded_learners = [
    (2, "Maya", 180),
    (3, "Leo", 145),
    (4, "Sofia", 110),
    (5, "Arjun", 75),
    (6, "Emma", 35),
]
for learner_id, learner_name, learner_xp in seeded_learners:
    if db.query(User).filter(User.id == learner_id).first() is None:
        db.add(User(
            id=learner_id,
            name=learner_name,
            xp=learner_xp,
            streak=3 + learner_id,
            hearts=5,
            gems=100,
            last_activity=None,
        ))


# ---------------------------------------------------------
# COURSE
# ---------------------------------------------------------

course = db.query(Course).filter(Course.name == "Spanish").first()
if course is None:
    course = Course(name="Spanish", language="Spanish")
    db.add(course)
    db.flush()


# ---------------------------------------------------------
# UNIT
# ---------------------------------------------------------

unit = db.query(Unit).filter(
    Unit.course_id == course.id,
    Unit.order == 1,
).first()
if unit is None:
    unit = Unit(course_id=course.id, title="Basics", order=1)
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

additional_units = [
    ("Everyday Spanish", 2, [
        {
            "title": "At Home", "order": 1, "lesson_title": "Rooms and Home",
            "exercises": [
                {"type": "multiple_choice", "question": "What does 'casa' mean?", "answer": "House", "options": "House,Street,School,Store"},
                {"type": "translate", "question": "Translate: The house", "answer": "La casa", "options": None},
                {"type": "fill_blank", "question": "Mi ___ es grande", "answer": "casa", "options": None},
                {"type": "type_answer", "question": "Type the Spanish word for 'room'", "answer": "Habitación", "options": None},
                {"type": "match", "question": "Match the home words", "answer": "Casa", "options": "Casa,House,Puerta,Door,Mesa,Table"},
            ],
        },
        {
            "title": "People", "order": 2, "lesson_title": "People Around You",
            "exercises": [
                {"type": "multiple_choice", "question": "What does 'amigo' mean?", "answer": "Friend", "options": "Friend,Teacher,Neighbor,Family"},
                {"type": "translate", "question": "Translate: My friend", "answer": "Mi amigo", "options": None},
                {"type": "fill_blank", "question": "Ella es mi ___", "answer": "amiga", "options": None},
                {"type": "type_answer", "question": "Type the Spanish word for 'teacher'", "answer": "Maestro", "options": None},
                {"type": "match", "question": "Match the people words", "answer": "Amigo", "options": "Amigo,Friend,Maestra,Teacher,Vecino,Neighbor"},
            ],
        },
        {
            "title": "Daily Life", "order": 3, "lesson_title": "Everyday Actions",
            "exercises": [
                {"type": "multiple_choice", "question": "What does 'comer' mean?", "answer": "To eat", "options": "To eat,To sleep,To read,To walk"},
                {"type": "translate", "question": "Translate: I read", "answer": "Yo leo", "options": None},
                {"type": "fill_blank", "question": "Yo ___ agua", "answer": "bebo", "options": None},
                {"type": "type_answer", "question": "Type the Spanish word for 'to sleep'", "answer": "Dormir", "options": None},
                {"type": "match", "question": "Match the action words", "answer": "Leer", "options": "Leer,To read,Comer,To eat,Dormir,To sleep"},
            ],
        },
    ]),
    ("Getting Around", 3, [
        {
            "title": "Travel", "order": 1, "lesson_title": "Travel Basics",
            "exercises": [
                {"type": "multiple_choice", "question": "What does 'tren' mean?", "answer": "Train", "options": "Train,Car,Bus,Bicycle"},
                {"type": "translate", "question": "Translate: The bus", "answer": "El autobús", "options": None},
                {"type": "fill_blank", "question": "Voy en ___", "answer": "tren", "options": None},
                {"type": "type_answer", "question": "Type the Spanish word for 'car'", "answer": "Coche", "options": None},
                {"type": "match", "question": "Match the travel words", "answer": "Tren", "options": "Tren,Train,Coche,Car,Avión,Airplane"},
            ],
        },
        {
            "title": "Directions", "order": 2, "lesson_title": "Find Your Way",
            "exercises": [
                {"type": "multiple_choice", "question": "What does 'izquierda' mean?", "answer": "Left", "options": "Left,Right,Straight,Behind"},
                {"type": "translate", "question": "Translate: Turn right", "answer": "Gira a la derecha", "options": None},
                {"type": "fill_blank", "question": "Sigue todo ___", "answer": "recto", "options": None},
                {"type": "type_answer", "question": "Type the Spanish word for 'left'", "answer": "Izquierda", "options": None},
                {"type": "match", "question": "Match the directions", "answer": "Derecha", "options": "Derecha,Right,Izquierda,Left,Recto,Straight"},
            ],
        },
        {
            "title": "Places", "order": 3, "lesson_title": "Places in Town",
            "exercises": [
                {"type": "multiple_choice", "question": "What does 'parque' mean?", "answer": "Park", "options": "Park,Market,Station,Hotel"},
                {"type": "translate", "question": "Translate: The school", "answer": "La escuela", "options": None},
                {"type": "fill_blank", "question": "El banco está aquí", "answer": "aquí", "options": None},
                {"type": "type_answer", "question": "Type the Spanish word for 'hotel'", "answer": "Hotel", "options": None},
                {"type": "match", "question": "Match the town places", "answer": "Parque", "options": "Parque,Park,Escuela,School,Mercado,Market"},
            ],
        },
    ]),
]

unit_skill_groups = [(unit, skills_data)]
for unit_title, unit_order, unit_skills in additional_units:
    next_unit = db.query(Unit).filter(
        Unit.course_id == course.id,
        Unit.order == unit_order,
    ).first()
    if next_unit is None:
        next_unit = Unit(course_id=course.id, title=unit_title, order=unit_order)
        db.add(next_unit)
        db.flush()
    unit_skill_groups.append((next_unit, unit_skills))

for skill_unit, unit_skills in unit_skill_groups:
    for skill_data in unit_skills:
        skill = db.query(Skill).filter(
            Skill.unit_id == skill_unit.id,
            Skill.title == skill_data["title"],
        ).first()
        if skill is not None:
            continue

        skill = Skill(
            unit_id=skill_unit.id,
            title=skill_data["title"],
            order=skill_data["order"],
            xp_reward=20,
        )
        db.add(skill)
        db.flush()

        lesson = Lesson(skill_id=skill.id, title=skill_data["lesson_title"], order=1)
        db.add(lesson)
        db.flush()

        for index, exercise_data in enumerate(skill_data["exercises"], start=1):
            db.add(Exercise(
                lesson_id=lesson.id,
                type=exercise_data["type"],
                question=exercise_data["question"],
                answer=exercise_data["answer"],
                options=exercise_data["options"],
                order=index,
            ))

        if db.query(UserSkillProgress).filter_by(user_id=user.id, skill_id=skill.id).first() is None:
            db.add(UserSkillProgress(
                user_id=user.id, skill_id=skill.id, progress=0, crowns=0, completed=False,
            ))
        if db.query(UserLessonProgress).filter_by(user_id=user.id, lesson_id=lesson.id).first() is None:
            db.add(UserLessonProgress(user_id=user.id, lesson_id=lesson.id, completed=False))


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

daily_quests = [
    db.query(Quest).filter(Quest.title == quest.title).first() or quest
    for quest in daily_quests
]
for quest in daily_quests:
    if quest.id is None:
        db.add(quest)
db.flush()


# ---------------------------------------------------------
# MONTHLY QUEST
# ---------------------------------------------------------

monthly_quest = db.query(Quest).filter(Quest.title == "Complete 20 quests").first() or Quest(
    title="Complete 20 quests",
    description="Complete quests throughout the month.",
    icon="🏆",
    quest_type="complete_quests",
    period="monthly",
    target=20,
    reward_gems=50,
    active=True,
)

if monthly_quest.id is None:
    db.add(monthly_quest)
db.flush()


# ---------------------------------------------------------
# USER QUEST PROGRESS
# ---------------------------------------------------------

today = date.today()

for quest in daily_quests:
    if db.query(UserQuestProgress).filter_by(
        user_id=user.id, quest_id=quest.id, date=today
    ).first() is None:
        db.add(
            UserQuestProgress(
                user_id=user.id,
                quest_id=quest.id,
                date=today,
                progress=0,
                completed=False,
            )
        )

if db.query(UserQuestProgress).filter_by(
    user_id=user.id, quest_id=monthly_quest.id, date=today
).first() is None:
    db.add(
        UserQuestProgress(
            user_id=user.id, quest_id=monthly_quest.id, date=today,
            progress=0, completed=False,
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

achievements = [
    db.query(Achievement).filter(Achievement.title == achievement.title).first() or achievement
    for achievement in achievements
]
for achievement in achievements:
    if achievement.id is None:
        db.add(achievement)
db.flush()


# ---------------------------------------------------------
# USER ACHIEVEMENT PROGRESS
# ---------------------------------------------------------

for achievement in achievements:
    if db.query(UserAchievementProgress).filter_by(
        user_id=user.id, achievement_id=achievement.id
    ).first() is None:
        db.add(
            UserAchievementProgress(
                user_id=user.id, achievement_id=achievement.id,
                progress=0, completed=False,
            )
        )


# ---------------------------------------------------------
# SETTINGS
# ---------------------------------------------------------

if db.query(UserSettings).filter_by(user_id=user.id).first() is None:
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

if db.query(DailyActivity).filter_by(user_id=user.id, date=today).first() is None:
    db.add(
        DailyActivity(
            user_id=user.id, date=today, xp_earned=0,
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
