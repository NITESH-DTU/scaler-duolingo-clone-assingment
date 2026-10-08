import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
import models

from routes.course import router as course_router
from routes.lessons import router as lessons_router
from routes.exercises import router as exercises_router
from routes.progress import router as progress_router
from routes.user import router as user_router
from routes.profile import router as profile_router
from routes.leaderboard import router as leaderboard_router
from routes.settings import router as settings_router
from routes.quests import router as quests_router
from routes.achievements import router as achievements_router


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Duolingo Clone API")


# CORS
cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def normalize_vercel_service_path(request, call_next):
    # Vercel Services forwards the original /svc/api/... path to the backend.
    # The same API is mounted at /api/... for local development.
    path = request.scope.get("path", "")
    if path.startswith("/svc/api/"):
        request.scope["path"] = path[len("/svc"):]
        raw_path = request.scope.get("raw_path")
        if raw_path and raw_path.startswith(b"/svc/api/"):
            request.scope["raw_path"] = raw_path[len(b"/svc"):]
    return await call_next(request)


# Routes
app.include_router(course_router)
app.include_router(lessons_router)
app.include_router(exercises_router)
app.include_router(progress_router)
app.include_router(user_router)
app.include_router(profile_router)
app.include_router(leaderboard_router)
app.include_router(settings_router)
app.include_router(quests_router)
app.include_router(achievements_router)

@app.get("/")
def root():
    return {"message": "Duolingo API is running"}
