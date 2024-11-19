from typing import Annotated

import fastapi
from bojano.users.properties.dependencies import get_property
from bojano.users.properties.models import Property
from fastapi import Depends, Response

from .dependencies import get_full_month_name_from_mm
from .service import get_reservations_for_month
from .models import Reservation

router = fastapi.APIRouter(prefix="/{property_id}/reservations")


@router.get("/{year}")
async def reservation_annual_get(
    property: Annotated[Property, Depends(get_property)],
    year: int,
) -> Response:
    results: list[list[Reservation]] = []

    for i in range(1, 13):
        month = await get_full_month_name_from_mm(i)
        reservations = await get_reservations_for_month(property, year, month)
        results.append(reservations)

    return results


@router.get("/{year}/{month}")
async def reservation_month_get(
    property: Annotated[Property, Depends(get_property)],
    year: int,
    month: Annotated[str, Depends(get_full_month_name_from_mm)],
) -> Response:
    reservations = await get_reservations_for_month(property, year, month)
    return reservations
