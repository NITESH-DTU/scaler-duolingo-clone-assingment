# Duolingo Web App Clone

A full-stack Duolingo-inspired Spanish learning platform built for the Scaler SDE Fullstack assignment.

The application provides a structured learning path, interactive lessons, persistent learner progress, gamification, daily quests, achievements, leaderboard functionality, profile management, a mock shop, and a Duolingo-inspired responsive interface.

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI, SQLAlchemy
- **Database:** SQLite
- **Deployment:** Vercel + Render

---

## Live Demo

**Frontend:**  
https://scaler-duolingo-clone-assingment-itk84f5ns.vercel.app/

The backend is deployed separately on Render.

The application uses a single default learner (`id = 1`) with mocked authentication, as permitted by the assignment.

---

# Architecture

The application follows a client-server architecture where the frontend handles presentation and interaction while the backend owns validation, progression, gamification, and persistence.

    Browser
       │
       ▼
    Next.js Frontend
    TypeScript + Tailwind CSS
       │
       │ REST API
       ▼
    FastAPI Backend
       │
       ├── Course / Learning Path
       ├── Lessons
       ├── Exercise Validation
       ├── Progress
       ├── Gamification
       ├── Quests
       ├── Achievements
       ├── Profile
       └── Leaderboard
       │
       ▼
    SQLAlchemy ORM
       │
       ▼
    SQLite
    duolingo.db

The backend is the source of truth for important learner state such as XP, hearts, lesson completion, skill unlocking, streaks, quests, and achievements.

---

# Assignment Requirements Covered

| Requirement | Implementation |
|---|---|
| Learning path / skill tree | Dynamic Course → Unit → Skill → Lesson hierarchy |
| Locked / available / completed skills | Skill state calculated from learner progress |
| Skill progress | Persisted through `UserSkillProgress` |
| Crowns | Awarded for completed skills |
| Interactive lessons | Dedicated lesson player |
| Multiple choice | Implemented |
| Translation / word bank | Implemented |
| Matching | Implemented |
| Fill in the blank | Implemented |
| Typed answers | Implemented |
| Immediate feedback | Backend validation + frontend feedback |
| Progress indicator | Implemented in lesson player |
| Hearts | Incorrect answers reduce hearts |
| XP | Awarded for successful exercise attempts and lesson completion |
| Streak | Daily learning activity tracking |
| Gems | Quest rewards and shop currency |
| Daily quests | Persisted per learner |
| Achievements | Persisted and updated from learner activity |
| Leaderboard | XP-based leaderboard |
| Profile | Learner statistics and progress |
| Shop | Mock gem-based shop |
| Settings | Persisted learner preferences |
| Database persistence | SQLite + SQLAlchemy |
| Seeded course content | Spanish course and exercises |
| Authentication | Single mocked learner |
| Responsive UI | Tailwind CSS responsive layouts |
| Deployment | Vercel frontend + Render backend |

---

# Features

## 1. Learning Path

The home page provides a Duolingo-style learning path containing:

- Units
- Skills
- Locked skills
- Available skills
- Completed skills
- Progress indicators
- Crowns
- Lesson navigation

Skills are progressively unlocked based on learner completion.

The learning path is generated from backend course data instead of being hardcoded into the frontend.

The backend determines whether a skill is:

- `locked`
- `available`
- `completed`

and the frontend renders the returned state.

---

## 2. Interactive Lesson Player

The lesson player supports multiple exercise formats:

- Multiple choice
- Translation / word-bank exercises
- Matching
- Fill-in-the-blank
- Typed answers

Each exercise provides:

- Immediate correct/incorrect feedback
- Answer validation
- Lesson progress
- Heart management
- XP rewards
- Correct-answer feedback when an answer is incorrect

The lesson content is stored in the database.

The frontend determines which interaction to render based on the exercise type returned by the API.

---

## 3. Gamification

The application implements the major gamification systems required by the assignment.

### XP

XP is handled by the backend rather than being trusted to the frontend.

Correct exercise attempts award XP based on the exercise type.

Completing a lesson can provide additional completion and performance-based XP.

This avoids treating every lesson as an identical fixed XP reward.

XP is persisted on the learner, while daily XP is separately tracked for quests and activity.

A previously completed lesson does not repeatedly award its completion reward.

### Hearts

Incorrect answers reduce the learner's heart count.

Hearts are persisted on the backend.

The final demo database uses a large heart balance so the evaluator can freely test lessons without being blocked by the heart mechanic.

### Streak

The backend tracks the learner's last learning activity and calculates the streak based on consecutive learning days.

The streak system handles:

- First learning day
- Consecutive learning days
- Same-day activity
- Missed days
- Streak freezes

### Gems

Gems act as the application's virtual currency.

They can be earned through quests and spent through the mock shop.

### Crowns

Completed skills receive crowns to represent skill mastery.

Skill progress and crowns are persisted independently from the frontend UI.

---

## 4. Daily Quests

Daily quests are persisted for the learner.

Depending on the configured quest, the system can track:

- XP earned
- Lessons completed
- Exercises completed
- Learning activity

Quest progress is updated by the backend as the learner performs relevant actions.

Completing quests awards gems.

---

## 5. Achievements

The application includes persistent achievements.

Achievement progress can be based on:

- XP
- Streak
- Completed lessons

Achievement state is updated by the backend as learner activity occurs.

---

## 6. Leaderboard

The leaderboard ranks learners using XP.

Leaderboard data is retrieved from the backend rather than being hardcoded in the frontend.

---

## 7. Profile

The profile page provides an overview of learner activity and statistics, including:

- XP
- Streak
- Gems
- Hearts
- Learning progress
- Learner statistics

---

## 8. Shop

A mock gem-based shop is implemented.

Learners can spend gems on gameplay-related items such as:

- Hearts
- Streak freezes

The shop is intentionally simplified for the scope of the assignment.

---

## 9. Settings

The application includes a settings page for learner preferences.

Settings are persisted through the backend.

---

# How the Application Works

The core learning loop is:

    Learning Path
          ↓
        Skill
          ↓
        Lesson
          ↓
    Interactive Exercise
          ↓
    Answer Validation
          ↓
    XP / Hearts / Progress
          ↓
    Lesson Completion
          ↓
    Skill Progress
          ↓
    Next Skill Unlock

The backend is responsible for important state transitions.

For example:

1. The learner selects a lesson.
2. The frontend retrieves the lesson from the API.
3. The learner answers an exercise.
4. The answer is submitted to FastAPI.
5. The backend validates the answer.
6. Incorrect answers reduce hearts.
7. Correct answers can award XP.
8. Daily activity is updated.
9. Quest progress is updated.
10. Achievement progress is updated.
11. Completing a lesson updates skill progress.
12. Skill completion can unlock the next skill.

This keeps the backend as the source of truth for learner state.

---

# Frontend Architecture

The frontend uses the Next.js App Router.

    frontend/
    └── src/
        ├── app/
        │   ├── page.tsx
        │   ├── lesson/[id]/
        │   ├── leaderboard/
        │   ├── profile/
        │   ├── quests/
        │   ├── shop/
        │   └── settings/
        │
        ├── components/
        ├── lib/
        └── types/

Reusable components are used for major UI sections such as:

- Sidebar
- Top statistics
- Learning path
- Skill nodes
- Unit headers
- Right-side cards
- Exercise cards
- Progress indicators

The UI uses Tailwind CSS and Duolingo-inspired visual patterns including rounded controls, layered button shadows, skill nodes, progress states, and clear feedback states.

---

# Backend Architecture

The backend is separated into FastAPI route modules.

    backend/
    ├── main.py
    ├── database.py
    ├── models.py
    ├── schemas.py
    ├── seed.py
    ├── duolingo.db
    └── routes/
        ├── course.py
        ├── lessons.py
        ├── exercises.py
        ├── progress.py
        ├── user.py
        ├── profile.py
        ├── leaderboard.py
        ├── settings.py
        ├── quests.py
        └── achievements.py

Each route module owns a specific area of application functionality rather than putting the entire API into one file.

---

# Database Design

The course content follows this hierarchy:

    Course
      │
      └── Unit
           │
           └── Skill
                │
                └── Lesson
                     │
                     └── Exercise

Learner state is stored separately:

    User
     ├── UserSkillProgress
     ├── UserLessonProgress
     ├── UserExerciseProgress
     ├── DailyActivity
     ├── UserQuestProgress
     ├── UserAchievementProgress
     └── UserSettings

This separation keeps course content independent from individual learner progress.

## Database Tables

### Course Content

- `courses`
- `units`
- `skills`
- `lessons`
- `exercises`

### Learner Progress

- `users`
- `user_skill_progress`
- `user_lesson_progress`
- `user_exercise_progress`
- `daily_activities`
- `user_settings`

### Gamification

- `quests`
- `user_quest_progress`
- `achievements`
- `user_achievement_progress`

SQLAlchemy models define the relationships between these entities.

---

# Exercise Validation

Answer validation is performed by the backend.

The frontend submits answers through:

    POST /api/v1/exercises/{exercise_id}/answer

The backend:

1. Retrieves the exercise.
2. Determines the exercise type.
3. Validates the submitted answer.
4. Deducts a heart when the answer is incorrect.
5. Awards XP when appropriate.
6. Updates daily XP.
7. Updates relevant quests.
8. Updates achievements.
9. Returns the result to the frontend.

Text answers are normalized before comparison so differences in casing and whitespace do not incorrectly cause an answer to fail.

Matching exercises use dedicated pair validation.

This prevents the frontend from becoming the source of truth for correctness and rewards.

---

# Progress and Skill Unlocking

Lesson completion is persisted in the database.

Skill progress is calculated from completed lessons belonging to that skill.

Conceptually:

    Lesson 1 ✓
    Lesson 2 ✓
    Lesson 3 ✓
          │
          ▼
    Skill completed
          │
          ▼
    Next skill becomes available

The backend calculates the current skill state and the frontend renders it.

This keeps progression rules centralized rather than allowing the UI to decide which content should be unlocked.

---

# XP and Reward System

XP is intentionally handled server-side.

The reward flow is:

    Correct Exercise
           ↓
       Exercise XP
           ↓
      Daily Activity
           ↓
       Quest Progress
           ↓
    Achievement Progress

Lesson completion can additionally provide completion/performance XP.

Exercise XP can vary depending on exercise type.

This creates a more meaningful progression system than awarding the same fixed amount for every lesson.

Repeated completion of an already completed lesson does not repeatedly award the lesson completion reward.

---

# Seed Data

The repository contains seeded Spanish learning content.

The seed process creates:

- Course data
- Units
- Skills
- Lessons
- Exercises
- Default learner
- Supporting gamification data

The default learner uses:

    User ID: 1

Authentication is intentionally mocked because the assignment allows a single default learner.

---

# API Overview

All API routes are exposed under:

    /api/v1

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/me` | Retrieve current learner |
| GET | `/profile` | Retrieve learner profile/statistics |
| GET | `/course/path` | Retrieve learning path |
| GET | `/lessons/{id}` | Retrieve lesson content |
| POST | `/exercises/{id}/answer` | Validate an exercise answer |
| POST | `/lessons/{id}/complete` | Complete a lesson |
| GET | `/leaderboard` | Retrieve leaderboard |
| GET | `/quests` | Retrieve quests |
| GET | `/achievements` | Retrieve achievements |
| GET/PATCH | `/settings` | Read/update settings |
| GET | `/shop` | Retrieve shop items |
| POST | `/shop/buy/heart` | Purchase a heart |
| POST | `/shop/buy/streak-freeze` | Purchase a streak freeze |
| POST | `/hearts/refill` | Refill hearts |

FastAPI provides interactive API documentation at:

    /docs

---

# Local Development

## Requirements

- Node.js 20.9+
- Python 3.10+
- npm

## Backend

From the repository root:

    cd backend
    py -3 -m venv venv
    .\venv\Scripts\Activate.ps1
    python -m pip install -r requirements.txt
    python seed.py
    uvicorn main:app --reload --host 127.0.0.1 --port 8000

The API will run at:

    http://127.0.0.1:8000

FastAPI documentation:

    http://127.0.0.1:8000/docs

The local database is:

    backend/duolingo.db

## Frontend

Open another terminal:

    cd frontend
    npm ci
    Copy-Item .env.example .env.local
    npm run dev

The frontend will run at:

    http://localhost:3000

---

# Environment Variables

For local development, the frontend API can point to the local FastAPI service:

    NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1

The backend uses SQLite by default:

    DATABASE_URL=sqlite:///./duolingo.db

If the browser communicates directly with the backend, the appropriate frontend origin must also be included in the backend CORS configuration.

---

# Testing

## Backend

If the backend test suite is present:

    cd backend
    python -m unittest discover -s tests -v

## Frontend

    cd frontend
    npm run lint
    npm run build

---

# Deployment

The application is deployed using:

    Frontend → Vercel
    Backend  → Render
    Database → SQLite

The current frontend deployment is:

https://scaler-duolingo-clone-assingment-itk84f5ns.vercel.app/

The FastAPI backend is deployed as a Render web service.

The Render service starts with:

    uvicorn main:app --host 0.0.0.0 --port $PORT

The seeded SQLite database is included in the repository so that the deployed demo starts with deterministic course content.

The deployed setup intentionally uses SQLite because SQLite is part of the assignment requirements.

---

# SQLite Deployment Tradeoff

SQLite was selected because it is explicitly required by the assignment and provides a simple, self-contained persistence layer.

For the deployed evaluation environment, the seeded database is committed with the project and used as the initial application state.

This provides:

- Deterministic seeded content
- No external database dependency
- Simple local reproduction
- Simple deployment configuration

However, an ephemeral hosting filesystem is not equivalent to a production-grade persistent database.

For a production-scale version, the application would use a durable managed database such as PostgreSQL while retaining the SQLAlchemy data-access layer.

This tradeoff was intentionally accepted to satisfy the assignment's SQLite requirement.

---

# Why the Backend Owns Game State

Important game state is maintained by the backend rather than being trusted to the frontend.

The frontend does not independently determine:

- Whether an answer is correct
- How much XP should be awarded
- Whether a lesson is completed
- Whether a skill is unlocked
- How many hearts remain
- How streaks are updated
- Whether quests are completed
- Whether achievements are completed

Instead:

    Frontend Action
          ↓
       FastAPI
          ↓
    Validation / Business Logic
          ↓
    Database Update
          ↓
     Updated State
          ↓
       Frontend

This provides a consistent source of truth and prevents the core learning progression from depending entirely on client-side state.

---

# Design Decisions

## FastAPI

FastAPI was selected because it provides:

- Lightweight REST API development
- Automatic OpenAPI documentation
- Request validation
- Clear route separation
- Straightforward SQLAlchemy integration

## SQLAlchemy

SQLAlchemy provides the ORM layer between the API and SQLite.

This keeps database operations structured and separated from frontend concerns.

## SQLite

SQLite satisfies the assignment's database requirement and keeps local setup simple.

No external database service is required for local development.

## Mock Authentication

A full authentication system was intentionally not implemented because the assignment allows a single default learner.

The application therefore uses:

    User ID = 1

The implementation focuses on the required learning, progression, persistence, and gamification functionality.

---

# UI / UX

The interface is inspired by the visual language of modern language-learning applications.

The frontend includes:

- Persistent left navigation
- Top learner statistics
- Learning path
- Large skill nodes
- Locked/available/completed states
- Progress indicators
- Rounded controls
- Layered button shadows
- Gamification cards
- Responsive layouts
- Immediate answer feedback

The learning path uses a winding visual arrangement to make progression feel like a learning journey rather than a standard list.

The lesson interface uses large interaction areas and clear feedback to keep the learning flow simple and fast.

---

# Project Structure

    duolingo-clone/
    │
    ├── backend/
    │   ├── main.py
    │   ├── database.py
    │   ├── models.py
    │   ├── schemas.py
    │   ├── seed.py
    │   ├── duolingo.db
    │   │
    │   └── routes/
    │       ├── course.py
    │       ├── lessons.py
    │       ├── exercises.py
    │       ├── progress.py
    │       ├── user.py
    │       ├── profile.py
    │       ├── leaderboard.py
    │       ├── settings.py
    │       ├── quests.py
    │       └── achievements.py
    │
    ├── frontend/
    │   └── src/
    │       ├── app/
    │       │   ├── lesson/
    │       │   ├── leaderboard/
    │       │   ├── profile/
    │       │   ├── quests/
    │       │   ├── shop/
    │       │   └── settings/
    │       │
    │       ├── components/
    │       ├── lib/
    │       └── types/
    │
    ├── README.md
    ├── render.yaml
    └── .gitignore

---

# Recommended Evaluation Flow

An evaluator can quickly test the application using the following flow:

1. Open the deployed frontend.
2. Inspect the learning path.
3. Identify the available skill.
4. Start a lesson.
5. Try the different exercise types.
6. Submit a correct answer and observe feedback/XP.
7. Submit an incorrect answer and observe heart deduction.
8. Complete the lesson.
9. Return to the learning path.
10. Observe lesson and skill progress.
11. Open Daily Quests.
12. Open the Leaderboard.
13. Open Profile.
14. Open Shop.
15. Open Settings.
16. Refresh the application and verify that learner state is retrieved from the backend.

---

# Scope and Simplifications

The following areas were intentionally simplified for the assignment:

### Authentication

A single default learner is used instead of implementing a complete authentication system.

### Social Features

Friend systems, social feeds, and real-time multiplayer functionality are outside the assignment scope.

### Shop

The shop is a functional mock rather than a real payment system.

### Course Content

The seeded Spanish course is intentionally focused on demonstrating the learning and progression systems rather than representing a complete language curriculum.

### Production Infrastructure

The assignment uses SQLite as required. A production-scale application would use a durable managed database and more extensive infrastructure.

---

# Future Improvements

Potential extensions include:

- Real authentication and multiple learner accounts
- Durable managed production database
- Larger dynamically generated course content
- Audio pronunciation
- Speech recognition
- Additional exercise types
- Real-time multiplayer leaderboard
- Notifications and reminders
- Production monitoring and logging
- Learning analytics
- Offline lesson support

---

# Final Demo Flow

The complete learning loop is:

    Discover
       ↓
    Choose Skill
       ↓
    Start Lesson
       ↓
    Solve Exercises
       ↓
    Receive Immediate Feedback
       ↓
    Earn XP / Manage Hearts
       ↓
    Complete Lesson
       ↓
    Update Progress
       ↓
    Unlock More Content
       ↓
    Continue Learning

The project goes beyond a static UI clone by connecting the frontend, backend, database, progression system, answer validation, rewards, quests, achievements, and leaderboard into a single persistent learning experience.