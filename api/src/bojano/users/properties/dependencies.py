from typing import Annotated

import fastapi
from bojano.users.dependencies import get_user
from bojano.users.models import User
from fastapi import Depends

from .exceptions import PropertyNotFoundError
from .models import Property
from .service import get_property_by_id


async def get_property(
    property_id: str, user: Annotated[User, Depends(get_user)]
) -> Property:
    try:
        property = await get_property_by_id(user, property_id)
    except PropertyNotFoundError as exc:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    return property
