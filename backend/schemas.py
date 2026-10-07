from pydantic import BaseModel


class AnswerRequest(BaseModel):
    answer: str


class UserResponse(BaseModel):
    id: int
    name: str
    xp: int
    streak: int
    hearts: int
    gems: int