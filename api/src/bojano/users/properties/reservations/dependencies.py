import fastapi

from .exceptions import InvalidMonthError
from .service import FullMonthName, convert_int_month_to_full_month_name


async def get_full_month_name_from_mm(month: int) -> FullMonthName:
    try:
        return await convert_int_month_to_full_month_name(month)
    except InvalidMonthError as exc:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
