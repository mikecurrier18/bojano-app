from typing import Annotated

import fastapi

from .. import models as user_models
from .. import service as user_service
from .exceptions import PropertyNotFoundError
from .models import PropertyCreate
from .service import get_properties_by_user, get_property_by_id

router = fastapi.APIRouter(prefix="/{user_id}/properties")


@router.post("/")
async def create_property(
    payload: PropertyCreate,
    request: fastapi.Request,
) -> fastapi.Response:
    raise NotImplementedError


@router.get("/")
async def get_properties(
    user: Annotated[
        user_models.User,
        fastapi.Depends(user_service.get_user_by_id),
    ],
) -> fastapi.Response:
    properties = await get_properties_by_user(user)
    return properties


@router.get("/{property_id}")
async def get_property(
    property_id: str,
    user: Annotated[
        user_models.User,
        fastapi.Depends(user_service.get_user_by_id),
    ],
) -> fastapi.Response:
    try:
        property = await get_property_by_id(user, property_id)
    except PropertyNotFoundError as exc:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    return property
