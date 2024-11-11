import logging

from fastapi import FastAPI, Response, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException
from pydantic import BaseModel

from .errors import UserNotFoundError
from .users import get_user_by_id

app = FastAPI()

_log = logging.getLogger(__name__)


class CreateExpenseSheetPayload(BaseModel):
    id: str
    year: int


@app.post("/api/v1/expense_sheet")
async def create_expense_sheet(payload: CreateExpenseSheetPayload) -> Response:
    """Add a new expense sheet to the database.

    Examples
    --------
    >>> spreadsheet_id = ""  # Google Sheets spreadsheet ID
    >>> payload = {"id": spreadsheet_id, "year": 2024}
    >>> r = httpx.post("/api/expense_sheet", json=payload)
    >>> assert r.status_code == 201, r.status_code
    """
    raise NotImplementedError


@app.get("/api/v1/expense_sheet/{year}")
async def get_expense_sheet(year: int) -> Response:
    raise NotImplementedError


class CreateUserPayload(BaseModel):
    first_name: str
    last_name: str
    email_address: list[str]


@app.post("/api/v1/users")
async def create_user(payload: CreateUserPayload) -> Response:
    raise NotImplementedError


@app.get("/api/v1/users/{user_id}")
async def get_user(user_id: str) -> Response:
    try:
        user = get_user_by_id(user_id)
    except UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="user not found",
        )
    except Exception as exc:
        # Anything that lands here is an unexpected error.
        _log.exception(f"internal server error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return jsonable_encoder(user)
