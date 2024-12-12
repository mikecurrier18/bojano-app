from typing import Annotated

import fastapi
from bojano.users.dependencies import get_user
from bojano.users.models import User
from fastapi import Depends, Request, Response

from .dependencies import get_property
from .models import Property, PropertyCreate
from .service import get_properties_by_user

router = fastapi.APIRouter(prefix="/{user_id}/properties")


@router.post("/")
async def property_post(
    payload: PropertyCreate,
    request: Request,
) -> Response:
    raise NotImplementedError


@router.get("/")
async def properties_get(user: Annotated[User, Depends(get_user)]) -> Response:
    try:
        properties = await get_properties_by_user(user)
    except Exception as exc:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )
    return fastapi.encoders.jsonable_encoder(properties)


@router.get("/{property_id}")
async def property_get(
    property: Annotated[Property, Depends(get_property)],
) -> Response:
    return fastapi.encoders.jsonable_encoder(property)
