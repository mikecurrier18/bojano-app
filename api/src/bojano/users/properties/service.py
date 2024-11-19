import logging

from bojano.database import db
from bojano.users import service as user_service

from .exceptions import PropertyNotFoundError
from .models import Property

log = logging.getLogger(__name__)


async def get_properties_by_user(user: user_service.User) -> list[Property]:
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

            property = Property(
                id=id,
                user_id=user_id,
                name=name,
            )

            properties.append(property)
    except Exception as exc:
        log.exception(f"an unexpected error occurred: {exc}")
        exc.add_note(f"failed to get properties of user {user.id!r}")
        raise exc

    return properties


async def get_property_by_id(
    user: user_service.User,
    property_id: str,
) -> Property:
    # We get all properties for the current user and filter out for
    # the specified ID so that we can validate that the property does belong
    # to the current user. Otherwise, you'd be able to search for any property
    # as long as you are signed in.
    properties = await get_properties_by_user(user)
    properties_valid = tuple(filter(lambda p: p.id == property_id, properties))
    assert len(properties_valid) < 2, len(properties_valid)

    if len(properties_valid) == 0:
        raise PropertyNotFoundError(property_id)

    return properties_valid[0]
