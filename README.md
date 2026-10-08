# Duolingo Web App Clone

A Duolingo-inspired Spanish learning app built for a full-stack assignment. The repository contains a Next.js + TypeScript frontend and a FastAPI + SQLAlchemy backend. SQLite is used locally; PostgreSQL is supported for persistent hosted deployments.

## Features

- Learning path with available, completed, and locked skills, progress, crowns, and lesson navigation.
- Lesson player with multiple choice, tap-to-build translation word bank, matching, fill-in-the-blank, and typed answers.
- Immediate answer feedback, progress bar, hearts, end-of-lesson state, and per-question XP allocation (20 XP across a five-question lesson).
- Persistent learner XP, hearts, gems, streak, lesson/skill progress, daily quests, achievements, settings, and leaderboard.
- Profile, leaderboard, quests, shop, and settings pages.
- Seeded Spanish course with three skills, three lessons, and fifteen varied exercises.

The app assumes a single default learner (id 1); authentication and social features are intentionally mocked for this assignment.

## Requirements

- Node.js 20.9 or newer (Next.js 16 requirement)
- Python 3.10 or newer
- npm

## Run locally (Windows PowerShell)

Open two terminals at the repository root.

### Backend

```powershell
cd backend
py -3 -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python seed.py
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API uses `http://127.0.0.1:8000`; interactive API documentation is at `/docs`. The default database is `backend/duolingo.db`. Seeding is safe by default: if a learner already exists, it makes no changes. To deliberately erase and recreate the local database, run `python seed.py --reset` from `backend/`.

### Frontend

```powershell
cd frontend
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The Next.js rewrite proxies `/svc/api/v1/*` to the local FastAPI server on port 8000.

For bash or macOS/Linux, use `python3 -m venv venv`, `source venv/bin/activate`, and `cp .env.example .env` in the backend; the frontend commands are the same except use `cp .env.example .env.local`.

## Configuration

Backend settings are read from environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `sqlite:///./duolingo.db` | SQLAlchemy database URL. PostgreSQL URLs using `postgres://` or `postgresql://` are normalized to psycopg 3. |
| `CORS_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` | Comma-separated allowed browser origins. |

For the standard hosted setup, set `BACKEND_PROXY_URL` in the Vercel project to the Render API origin (for example, `https://duolingo-api.onrender.com`). The Next.js server rewrites `/svc/api/*` to that backend, so browser calls remain same-origin. `NEXT_PUBLIC_API_URL` is optional for a setup where the browser should call the API directly; in that case, also set backend `CORS_ORIGINS` to the frontend origin.

## Architecture

```text
Browser
  └── Next.js App Router (frontend/src)
        └── /svc/api/v1/* proxy (local or hosted Next.js rewrite)
              └── FastAPI routers (backend/routes)
                    └── SQLAlchemy models and session (backend/models.py, database.py)
                          └── SQLite locally / PostgreSQL when hosted
```

The frontend API client is in `frontend/src/lib/api.ts`; shared API response types are in `frontend/src/types/api.ts`. FastAPI route modules own the course, lesson, answer checking, progress, learner, profile, leaderboard, settings, quest, and achievement endpoints. `backend/seed.py` creates the demo course and initial learner.

## Database schema

Content tables: `courses` → `units` → `skills` → `lessons` → `exercises`. Learner and gamification tables: `users`, `user_skill_progress`, `user_lesson_progress`, `user_exercise_progress`, `daily_activities`, `quests`, `user_quest_progress`, `achievements`, `user_achievement_progress`, and `user_settings`. Foreign keys connect each progress row to its learner and content; unique constraints prevent duplicate per-user progress records and daily activity/quest records.

## API overview

All endpoints are under `/api/v1` (the web app accesses them via `/svc/api/v1`).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/me`, `/profile`, `/course/path` | Learner summary, profile stats, and learning path |
| GET | `/lessons/{id}` | Lesson questions and safe-to-show choices/word bank |
| POST | `/exercises/{id}/answer` | Check one answer, update hearts, XP, and related progress |
| POST | `/lessons/{id}/complete` | Complete lesson and update skill/streak progress |
| GET | `/leaderboard`, `/quests`, `/achievements` | Gamification views |
| GET/PATCH | `/settings` | Read/update learner preferences |
| GET | `/shop` | Mocked gem shop inventory |
| POST | `/shop/buy/heart`, `/shop/buy/streak-freeze`, `/hearts/refill` | Buy a heart or streak freeze, or refill one heart |

FastAPI's `/docs` page lists request and response schemas.

## Checks

From `backend/`, run the isolated API regression suite:

```powershell
python -m unittest discover -s tests -v
```

The tests create and remove `.test_duolingo.sqlite3`; they do not use the learner's `duolingo.db`.

From `frontend/`, run the available static checks:

```powershell
npm run lint
npm run build
```

## Hosting readiness (not deployed)

The repository includes a standard Vercel + Render setup. Deploy `frontend/` as a Next.js project on Vercel, and use the root `render.yaml` Blueprint to create the FastAPI service and PostgreSQL database on Render. Next.js rewrites `/svc/api/*` to the configured `BACKEND_PROXY_URL`; Render's `preDeployCommand` safely seeds the database on first deployment. Vercel rewrites keep the browser URL same-origin while forwarding the request to the API ([Vercel rewrites](https://vercel.com/docs/routing/rewrites)); Render Blueprints define the API service and linked database ([Blueprint reference](https://render.com/docs/blueprint-spec), [monorepo root directories](https://render.com/docs/monorepo-support)).

Deployment steps after pushing:

1. Create a Render Blueprint from the repository. The API service uses Render's `starter` plan so its pre-deploy seed command can run; the linked PostgreSQL database uses the persistent `basic-256mb` plan. Both are paid resources. Review Render's current pricing before creating them; Render reserves pre-deploy commands for paid web services ([deploy commands](https://render.com/docs/deploys)).
2. Create a Vercel project with `frontend/` as its root directory and set `BACKEND_PROXY_URL` to the public Render API origin, without a trailing slash or `/api` path. The frontend build then includes the correct same-origin API rewrite.
3. Wait for both services to become healthy, then verify the home path, lesson answer loop, restart persistence, and leaderboard on the hosted app.
4. Add the deployed frontend URL and public repository URL to the assignment submission after deployment.

The project has not been pushed or deployed. The owner plans to do both after local work is complete.
