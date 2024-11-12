import logging

from fastapi import FastAPI, Request, Response, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException
from pydantic import BaseModel

from .errors import PropertyNotFoundError, UserNotFoundError
from .properties import (
    create_property,
    get_properties_by_user,
    get_property_by_id,
)
from .users import get_user_by_id

app = FastAPI()

_log = logging.getLogger(__name__)


class CreateExpenseSheetPayload(BaseModel):
    id: str
    year: int


@app.post("/api/v1/expense_sheet")
async def expense_sheets_post(payload: CreateExpenseSheetPayload) -> Response:
    """Add a new expense sheet to the database.

    Examples
    --------
    >>> spreadsheet_id = ""  # Google Sheets spreadsheet ID
    >>> payload = {"id": spreadsheet_id, "year": 2024}
    >>> r = httpx.post("/api/expense_sheet", json=payload)
    >>> assert r.status_code == 201, r.status_code
    """
    raise NotImplementedError


@app.get("/api/v1/expense_sheets/{year}")
async def expense_sheet_get(year: int) -> Response:
    raise NotImplementedError


class CreateUserPayload(BaseModel):
    first_name: str
    last_name: str
    email_address: list[str]


@app.post("/api/v1/users")
async def users_post(payload: CreateUserPayload) -> Response:
    raise NotImplementedError


@app.get("/api/v1/users/{user_id}")
async def user_get(user_id: str) -> Response:
    try:
        user = await get_user_by_id(user_id)
    except UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="user not found",
        )
    except Exception as exc:
        _log.exception(f"an unexpected error occurred: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return jsonable_encoder(user)


class CreatePropertyPayload(BaseModel):
    name: str
    airbnb_id: str | None
    vrbo_id: str | None


@app.post("/api/v1/users/{user_id}/properties")
async def properties_post(
    user_id: str,
    payload: CreatePropertyPayload,
    request: Request,
) -> Response:
    try:
        user = await get_user_by_id(user_id)
        property = await create_property(
            user=user,
            name=payload.name,
            airbnb_id=payload.airbnb_id,
            vrbo_id=payload.vrbo_id,
        )
    except UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="user not found",
        )
    except Exception as exc:
        _log.exception(f"an unexpected error occurred: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    Response(
        content=jsonable_encoder(property),
        status_code=status.HTTP_201_CREATED,
        headers={"Location": request.url + f"/{property.id}"},
    )


@app.get("/api/v1/users/{user_id}/properties")
async def properties_get(user_id: str) -> Response:
    try:
        user = await get_user_by_id(user_id)
        properties = await get_properties_by_user(user)
    except UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="user not found",
        )
    except Exception as exc:
        _log.exception(f"an unexpected error occurred: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return jsonable_encoder(properties)


@app.get("/api/v1/users/{user_id}/properties/{property_id}")
async def property_get(user_id: str, property_id: str) -> Response:
    try:
        user = await get_user_by_id(user_id)
        property = await get_property_by_id(property_id)

        if property.user_id != user.id:
            raise PropertyNotFoundError(property_id)

    except UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="user not found",
        )
    except PropertyNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="property not found",
        )
    except Exception as exc:
        _log.exception(f"an unexpected error occurred: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return jsonable_encoder(property)
