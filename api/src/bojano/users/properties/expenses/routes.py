from typing import Annotated

import fastapi
from bojano.users.models import User
from bojano.users.properties.models import Property
from bojano.users.properties.service import get_property_by_id
from bojano.users.service import get_user_by_id
from fastapi import Depends

from .service import get_expenses_by_year

router = fastapi.APIRouter(prefix="/{property_id}/expenses")


async def get_user(user_id: str) -> User:
    return await get_user_by_id(user_id)


async def get_property(
    user: Annotated[User, Depends(get_user)],
    property_id: str,
) -> Property:
    return await get_property_by_id(user, property_id)


@router.get("/{year}")
async def get_annual_expenses(
    year: int,
    property: Annotated[Property, Depends(get_property)],
) -> fastapi.Response:
    expenses = await get_expenses_by_year(property, year)
    return fastapi.encoders.jsonable_encoder(expenses)


@router.get("/{year}/{month}")
async def get_monthly_expenses(
    year: int,
    month: int,
    property: Annotated[Property, Depends(get_property_by_id)],
) -> fastapi.Response:
    return "{}"
