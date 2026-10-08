"""Database-backed tests for the core lesson and progress workflows.

Run from backend/ with: python -m unittest discover -s tests -v
The suite uses its own ignored SQLite file and never touches duolingo.db.
"""

import os
import unittest
from pathlib import Path

os.environ["DATABASE_URL"] = "sqlite:///./.test_duolingo.sqlite3"

from database import Base, SessionLocal, engine  # noqa: E402
from models import (  # noqa: E402
    Course,
    Exercise,
    Lesson,
    Quest,
    Skill,
    Unit,
    User,
    UserExerciseProgress,
    UserQuestProgress,
)
from routes.course import get_learning_path  # noqa: E402
from routes.exercises import submit_answer  # noqa: E402
from routes.leaderboard import get_leaderboard  # noqa: E402
from routes.lessons import get_lesson  # noqa: E402
from routes.progress import complete_lesson  # noqa: E402
from schemas import AnswerRequest  # noqa: E402


class LearningApiTests(unittest.TestCase):
    def setUp(self):
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        self.db = SessionLocal()

        self.user = User(
            id=1,
            name="Test Learner",
            xp=0,
            streak=0,
            hearts=5,
            gems=0,
            streak_freezes=0,
        )
        course = Course(name="Spanish", language="Spanish")
        unit = Unit(course=course, title="Basics", order=1)
        skill = Skill(unit=unit, title="Greetings", order=1, xp_reward=20)
        self.lesson = Lesson(skill=skill, title="Greetings 1", order=1)
        self.exercises = [
            Exercise(
                lesson=self.lesson,
                type="translate" if index == 1 else "multiple_choice",
                question="Translate: I eat bread" if index == 1 else f"Question {index}",
                answer="Yo como pan" if index == 1 else f"answer {index}",
                options=None if index == 1 else f"answer {index},other,wrong,none",
                order=index,
            )
            for index in range(1, 6)
        ]
        self.xp_quest = Quest(
            title="Earn XP",
            description="Earn XP today",
            icon="⚡",
            quest_type="xp",
            period="daily",
            target=20,
            reward_gems=0,
            active=True,
        )
        self.exercise_quest = Quest(
            title="Answer exercises",
            description="Answer five exercises",
            icon="📚",
            quest_type="exercises",
            period="daily",
            target=5,
            reward_gems=0,
            active=True,
        )
        self.db.add_all([self.user, course, unit, skill, self.lesson, *self.exercises,
                         self.xp_quest, self.exercise_quest])
        self.db.commit()

    def tearDown(self):
        self.db.close()

    @classmethod
    def tearDownClass(cls):
        Base.metadata.drop_all(bind=engine)
        engine.dispose()
        Path(".test_duolingo.sqlite3").unlink(missing_ok=True)

    def answer(self, exercise, value):
        return submit_answer(
            exercise.id,
            AnswerRequest(answer=value),
            self.db,
        )

    def test_correct_answer_awards_equal_xp_once(self):
        first = self.answer(self.exercises[1], "answer 2")
        duplicate = self.answer(self.exercises[1], "answer 2")

        self.assertTrue(first["correct"])
        self.assertEqual(first["xp_earned"], 4)
        self.assertEqual(duplicate["xp_earned"], 0)
        self.db.refresh(self.user)
        self.assertEqual(self.user.xp, 4)

    def test_wrong_attempt_loses_heart_but_correct_retry_gets_xp(self):
        wrong = self.answer(self.exercises[1], "not correct")
        correct = self.answer(self.exercises[1], "answer 2")
        repeated = self.answer(self.exercises[1], "answer 2")

        self.assertFalse(wrong["correct"])
        self.assertEqual(wrong["hearts_remaining"], 4)
        self.assertEqual(correct["xp_earned"], 4)
        self.assertEqual(repeated["xp_earned"], 0)
        exercise_progress = self.db.query(UserExerciseProgress).filter_by(
            user_id=self.user.id,
            exercise_id=self.exercises[1].id,
        ).one()
        self.assertEqual(exercise_progress.xp_earned, 4)

    def test_full_lesson_awards_twenty_xp_and_completes_skill(self):
        per_answer = []
        for index, exercise in enumerate(self.exercises, start=1):
            answer = "Yo como pan" if index == 1 else f"answer {index}"
            per_answer.append(self.answer(exercise, answer)["xp_earned"])
        completion = complete_lesson(self.lesson.id, self.db)
        self.db.refresh(self.user)

        self.assertEqual(per_answer, [4, 4, 4, 4, 4])
        self.assertEqual(completion["xp_earned"], 0)
        self.assertEqual(self.user.xp, 20)
        self.assertEqual(completion["skill_progress"], 100)

    def test_lesson_endpoint_returns_a_word_bank_without_full_answer_field(self):
        lesson = get_lesson(self.lesson.id, self.db)
        translated = lesson["exercises"][0]

        self.assertIn("word_bank", translated)
        self.assertIn("Yo", translated["word_bank"])
        self.assertIn("como", translated["word_bank"])
        self.assertIn("pan", translated["word_bank"])
        self.assertNotIn("answer", translated)
        self.assertEqual(
            translated["word_bank"],
            get_lesson(self.lesson.id, self.db)["exercises"][0]["word_bank"],
        )

    def test_leaderboard_includes_learner_below_top_ten(self):
        self.db.add_all([
            User(name=f"Seeded learner {index}", xp=1000 - index, hearts=5)
            for index in range(11)
        ])
        self.db.commit()

        rows = get_leaderboard(self.db)
        learner = next(row for row in rows if row["name"] == self.user.name)

        self.assertEqual(len(rows), 11)
        self.assertEqual(learner["rank"], 12)
        self.assertEqual(learner["xp"], 0)

    def test_path_starts_with_first_skill_available(self):
        path = get_learning_path(self.db)
        first_skill = path["units"][0]["skills"][0]

        self.assertEqual(first_skill["status"], "available")
        self.assertEqual(first_skill["progress"], 0)


if __name__ == "__main__":
    unittest.main()
