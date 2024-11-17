from typing import Annotated

import fastapi
from bojano.expense_sheets.exceptions import ExpenseSheetNotFoundError
from bojano.users.properties.dependencies import get_property
from bojano.users.properties.models import Property
from fastapi import Depends

from .service import get_expenses_by_month, get_expenses_by_year

router = fastapi.APIRouter(prefix="/{property_id}/expenses")


@router.get("/{year}")
async def get_annual_expenses(
    year: int,
    property: Annotated[Property, Depends(get_property)],
) -> fastapi.Response:
    try:
        expenses_annual = await get_expenses_by_year(property, year)
    except ExpenseSheetNotFoundError as exc:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    return fastapi.encoders.jsonable_encoder(expenses_annual)


@router.get("/{year}/{month}")
async def get_monthly_expenses(
    year: int,
    month: int,
    property: Annotated[Property, Depends(get_property)],
) -> fastapi.Response:
    try:
        expenses_month = await get_expenses_by_month(property, year, month)
    except ExpenseSheetNotFoundError as exc:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    return fastapi.encoders.jsonable_encoder(expenses_month)
