import logging

import fastapi

from .exceptions import UserNotFoundError
from .models import UserCreate
from .service import get_user_by_id

router = fastapi.APIRouter(prefix="/users")
log = logging.getLogger(__name__)


@router.post("/")
async def create_user(payload: UserCreate) -> fastapi.Response:
    raise NotImplementedError


@router.get("/{user_id}")
async def get_user(user_id: str) -> fastapi.Response:
    try:
        user = await get_user_by_id(user_id)
    except UserNotFoundError as exc:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    return fastapi.encoders.jsonable_encoder(user)
