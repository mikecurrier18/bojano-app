import logging

import fastapi

from .exceptions import ExpenseSheetNotFoundError
from .service import get_expense_sheet_id_by_year

router = fastapi.APIRouter(prefix="/expense_sheets")
log = logging.getLogger(__name__)


@router.get("/{year}")
async def get_expense_sheet(year: int) -> fastapi.Response:
    try:
        expense_sheet = await get_expense_sheet_id_by_year(year)
    except ExpenseSheetNotFoundError as exc:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    return fastapi.encoders.jsonable_encoder(expense_sheet)
