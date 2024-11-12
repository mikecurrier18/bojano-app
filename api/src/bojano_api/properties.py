import logging
from typing import TypedDict

from bson.objectid import ObjectId
from pydantic import BaseModel

from .mongodb import db
from .users import User

_log = logging.getLogger(__name__)


class Property(BaseModel):
    id: str
    user_id: str
    name: str
    airbnb_id: str | None
    vrbo_id: str | None


class _Document(TypedDict):
    user_id: str
    name: str
    airbnb_id: str | None
    vrbo_id: str | None


async def create_property(
    user: User,
    name: str,
    airbnb_id: str | None = None,
    vrbo_id: str | None = None,
) -> Property:
    """Create a new property for user with ID `user_id`.

    Parameters
    ----------
    user: User
        The user who this property belongs to
    name: str
        A unique name used to identify the property
    airbnb_id: str, optional
        The property ID from Airbnb
    vrbo_id: str, optional
        The property ID from Airbnb

    Returns
    -------
    Property
        The newly-created property
    """
    collection = db["property"]
    document = _Document(
        user_id=user.id,
        name=name,
        airbnb_id=airbnb_id,
        vrbo_id=vrbo_id,
    )

    try:
        response = await collection.insert_one(document)
    except Exception as exc:
        _log.exception(f"an unexpected error occurred: {exc}")
        exc.add_note("failed to add new property to the property collection")
        raise exc

    assert "_id" in response, str(response)
    property = Property(id=response["_id"], **document)
    return property


async def get_properties_by_user(user: User) -> list[Property]:
    collection = db["property"]
    properties: list[Property] = []

    try:
        async for document in collection.find({"user_id": user.id}):
            assert "_id" in document, document.keys()
            id = str(document["_id"])  # The type of _id is ObjectId.

            assert "user_id" in document, document.keys()
            user_id = document["user_id"]

            assert "name" in document, document.keys()
            name = document["name"]

            # In the dev database, these keys are not present...
            airbnb_id = document.get("airbnb_id", None)
            vrbo_id = document.get("vrbo_id", None)

            property = Property(
                id=id,
                user_id=user_id,
                name=name,
                airbnb_id=airbnb_id,
                vrbo_id=vrbo_id,
            )

            properties.append(property)

    except Exception as exc:
        _log.exception(f"an unexpected error occurred: {exc}")
        exc.add_note(f"failed to get properties of user {user.id!r}")
        raise exc

    return properties


async def get_property_by_id(property_id: str) -> Property:
    """Get information about a property from their ID.

    Parameters
    ----------
    property_id:
        The ID of the property we are trying to look up

    Raises
    ------
    InvalidDatabaseURIError
        If the secret API key we are using is invalid
    PropertyNotFoundError
        The ID provided does not match any of the properties in the database

    Returns
    -------
    Property
        Information about the user
    """
    collection = db["property"]

    try:
        response = await collection.find_one({"_id": ObjectId(property_id)})
    except Exception as exc:
        _log.exception(f"an unexpected error occurred: {exc}")
        exc.add_note(f"failed to get property with id {property_id!r}")
        raise exc

    assert "_id" in response, response.keys()
    id = str(response["_id"])

    assert "user_id" in response, response.keys()
    user_id = response["user_id"]

    assert "name" in response, response.keys()
    name = response["name"]

    # In the dev database, these key are not present...
    airbnb_id = response.get("airbnb_id", None)
    vrbo_id = response.get("vrbo_id", None)

    return Property(
        id=id,
        user_id=user_id,
        name=name,
        airbnb_id=airbnb_id,
        vrbo_id=vrbo_id,
    )
