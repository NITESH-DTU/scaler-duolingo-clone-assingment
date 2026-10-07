from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User


router = APIRouter(
    prefix="/api/v1",
    tags=["User"],
)

DEFAULT_USER_ID = 1

MAX_HEARTS = 5

HEART_REFILL_COST = 20
STREAK_FREEZE_COST = 50


def get_default_user(
    db: Session,
):
    user = (
        db.query(User)
        .filter(User.id == DEFAULT_USER_ID)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


@router.get("/me")
def get_me(
    db: Session = Depends(get_db),
):
    user = get_default_user(db)

    return {
        "id": user.id,
        "name": user.name,
        "xp": user.xp,
        "streak": user.streak,
        "hearts": user.hearts,
        "gems": user.gems,
        "streak_freezes": user.streak_freezes,
    }


@router.post("/hearts/refill")
def refill_heart(
    db: Session = Depends(get_db),
):
    user = get_default_user(db)

    if user.hearts >= MAX_HEARTS:
        raise HTTPException(
            status_code=400,
            detail="Hearts are already full",
        )

    if user.gems < HEART_REFILL_COST:
        raise HTTPException(
            status_code=400,
            detail=(
                f"You need {HEART_REFILL_COST} gems "
                "to refill a heart"
            ),
        )

    user.gems -= HEART_REFILL_COST
    user.hearts += 1

    db.commit()
    db.refresh(user)

    return {
        "hearts": user.hearts,
        "gems": user.gems,
    }


@router.get("/shop")
def get_shop(
    db: Session = Depends(get_db),
):
    user = get_default_user(db)

    return {
        "gems": user.gems,
        "hearts": user.hearts,
        "max_hearts": MAX_HEARTS,
        "streak_freezes": user.streak_freezes,
        "items": [
            {
                "id": "heart",
                "name": "Refill 1 Heart",
                "description": "Restore one missing heart.",
                "icon": "❤️",
                "cost": HEART_REFILL_COST,
                "currency": "gems",
                "available": user.hearts < MAX_HEARTS
                and user.gems >= HEART_REFILL_COST,
            },
            {
                "id": "streak_freeze",
                "name": "Streak Freeze",
                "description": "Protect your streak for one missed day.",
                "icon": "🧊",
                "cost": STREAK_FREEZE_COST,
                "currency": "gems",
                "available": user.gems >= STREAK_FREEZE_COST,
            },
        ],
    }


@router.post("/shop/buy/heart")
def buy_heart(
    db: Session = Depends(get_db),
):
    user = get_default_user(db)

    if user.hearts >= MAX_HEARTS:
        raise HTTPException(
            status_code=400,
            detail="Hearts are already full",
        )

    if user.gems < HEART_REFILL_COST:
        raise HTTPException(
            status_code=400,
            detail=(
                f"You need {HEART_REFILL_COST} gems "
                "to buy a heart"
            ),
        )

    user.gems -= HEART_REFILL_COST
    user.hearts += 1

    db.commit()
    db.refresh(user)

    return {
        "message": "Heart purchased successfully",
        "hearts": user.hearts,
        "gems": user.gems,
    }


@router.post("/shop/buy/streak-freeze")
def buy_streak_freeze(
    db: Session = Depends(get_db),
):
    user = get_default_user(db)

    if user.gems < STREAK_FREEZE_COST:
        raise HTTPException(
            status_code=400,
            detail=(
                f"You need {STREAK_FREEZE_COST} gems "
                "to buy a streak freeze"
            ),
        )

    user.gems -= STREAK_FREEZE_COST
    user.streak_freezes += 1

    db.commit()
    db.refresh(user)

    return {
        "message": "Streak Freeze purchased successfully",
        "streak_freezes": user.streak_freezes,
        "gems": user.gems,
    }