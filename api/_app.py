# TODO: Move all of this code into a package, and export the `app` name, then
# then re-export the app name outside of the package. We can probably do
# a pyproject.toml and then `from bojano_api import app` in an app.py file
# outside of the package.
#
# This is a prototype for the new FastAPI version of the API. It'll get cleaned
# up later (e.g., better error handling, smaller, more organized functions, etc.)  # noqa: E501

import logging
from typing import Any

import fastapi
import httpx
from fastapi import status
from google_sheets import get_google_sheets_service
from logger import enable_logging
from motor.motor_asyncio import AsyncIOMotorClient

from constants import CLERK_SECRET_KEY, MONGODB_URL

app = fastapi.FastAPI()
_log = logging.getLogger(__name__)


enable_logging()
sheets = get_google_sheets_service()
client = AsyncIOMotorClient(MONGODB_URL)
db = client["LAB"]


@app.post("/api/expense_sheet")
async def create_expense_sheet():
    """Add a new expense sheet to the database."""
    raise NotImplementedError


@app.get("/api/expense_sheet/{year}")
async def get_expense_sheet():
    """Get an expense sheet's spreadsheet ID for the given year."""
    raise NotImplementedError


@app.post("/api/users")
async def create_user():
    """Add a new user to the database."""
    raise NotImplementedError


@app.get("/api/users/{user_id}")
async def get_user(user_id: str):
    """Get a user's account information."""
    url = f"https://api.clerk.com/v1/users/{user_id}"
    headers = {"Authorization": f"Bearer {CLERK_SECRET_KEY}"}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

    # https://clerk.com/docs/reference/backend-api/tag/Users#operation/GetUser
    match response.status_code:
        case 401:
            assert "Authorization" in headers.keys(), headers.keys()
            _log.critical("The Clerk API key we are using is invalid")
            assert False, "invalid API key in 'CLERK_SECRET_KEY' env var"
        case 404:
            raise fastapi.HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

    data: dict[str, Any] = response.json()

    assert "id" in data, data.keys()
    id = data.get("id")
    assert "first_name" in data, data.keys()
    first_name = data.get("first_name")
    assert "last_name" in data, data.keys()
    last_name = data.get("last_name")
    assert "email_addresses" in data, data.keys()
    email_addresses = [
        entry["email_address"] for entry in data.get("email_addresses")
    ]

    return {
        "id": id,
        "first_name": first_name,
        "last_name": last_name,
        "email_addresses": email_addresses,
    }


@app.post("/api/users/{user_id}/properties")
async def create_property():
    """Add a new property to the current user."""
    raise NotImplementedError


@app.get("/api/users/{user_id}/properties")
async def get_properties():
    """Get all properties of the current user."""
    raise NotImplementedError


@app.get("/api/users/{user_id}/properties/{property_id}")
async def get_property_information():
    """Get a user's property information."""
    raise NotImplementedError


@app.post("/api/users/{user_id}/properties/{property_id}/expenses")
async def create_expense():
    raise NotImplementedError


@app.get("/api/users/{user_id}/properties/{property_id}/expenses/{year}")
async def get_expenses(user_id: str, property_id: str, year: int):
    # Validate user ID

    # Get expense sheet spreadsheet ID
    expense_sheet_collection = db["expense_sheet"]
    document = await expense_sheet_collection.find_one({"year": year})
    spreadsheet_id = document.get("_id")
    print(spreadsheet_id)

    # Get expenses from Google Sheets
    result = (
        sheets.values()
        .get(
            spreadsheetId=spreadsheet_id,
            range="Expenses!A:H",
            majorDimension="ROWS",
        )
        .execute()
    )

    values = result.get("values", [])
    assert len(values) > 0
    _ = values.pop(0)  # table headings

    print(values)

    return fastapi.encoders.jsonable_encoder(
        {"expense_sheet_id": spreadsheet_id}
    )


@app.post("/api/users/{user_id}/properties/{property_id}/reservations")
async def create_reservation():
    raise NotImplementedError


@app.get("/api/users/{user_id}/properties/{property_id}/reservations")
async def get_reservations():
    # TODO: Use URL queries to filter out the information that you need.
    raise NotImplementedError


@app.post("/api/users/{user_id}/properties/{property_id}/spreadsheets")
async def create_spreadsheet():
    raise NotImplementedError


@app.get("/api/users/{user_id}/properties/{property_id}/spreadsheets")
async def get_spreadsheets():
    raise NotImplementedError
