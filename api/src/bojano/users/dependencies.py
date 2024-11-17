import fastapi

from .exceptions import UserNotFoundError
from .models import User
from .service import get_user_by_id


async def get_user(user_id: str) -> User:
    try:
        user = await get_user_by_id(user_id)
    except UserNotFoundError as exc:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    return user
