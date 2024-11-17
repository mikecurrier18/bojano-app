import logging
from typing import Annotated

import fastapi
from fastapi import Depends

from .dependencies import get_user as get_user_by_id
from .models import User, UserCreate

router = fastapi.APIRouter(prefix="/users")
log = logging.getLogger(__name__)


@router.post("/")
async def create_user(payload: UserCreate) -> fastapi.Response:
    raise NotImplementedError


@router.get("/{user_id}")
async def get_user(
    user: Annotated[User, Depends(get_user_by_id)],
) -> fastapi.Response:
    return fastapi.encoders.jsonable_encoder(user)
