from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User, UserSettings

router = APIRouter(
    prefix="/api/v1/settings",
    tags=["Settings"]
)

DEFAULT_USER_ID = 1


@router.get("")
def get_settings(db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.id == DEFAULT_USER_ID
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    settings = db.query(UserSettings).filter(
        UserSettings.user_id == user.id
    ).first()

    if not settings:
        settings = UserSettings(
            user_id=user.id,
            sound_enabled=True,
            music_enabled=True,
            notifications_enabled=True
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return {
        "sound_enabled": settings.sound_enabled,
        "music_enabled": settings.music_enabled,
        "notifications_enabled": settings.notifications_enabled
    }


@router.patch("")
def update_settings(
    data: dict,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == DEFAULT_USER_ID
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    settings = db.query(UserSettings).filter(
        UserSettings.user_id == user.id
    ).first()

    if not settings:
        settings = UserSettings(user_id=user.id)
        db.add(settings)

    if "sound_enabled" in data:
        settings.sound_enabled = data["sound_enabled"]

    if "music_enabled" in data:
        settings.music_enabled = data["music_enabled"]

    if "notifications_enabled" in data:
        settings.notifications_enabled = data["notifications_enabled"]

    db.commit()
    db.refresh(settings)

    return {
        "sound_enabled": settings.sound_enabled,
        "music_enabled": settings.music_enabled,
        "notifications_enabled": settings.notifications_enabled
    }