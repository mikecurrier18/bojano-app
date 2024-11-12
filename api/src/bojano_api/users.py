import httpx
from pydantic import BaseModel

from .constants import CLERK_SECRET_KEY
from .errors import InvalidClerkAPIKeyError, UserNotFoundError


class User(BaseModel):
    id: str
    first_name: str
    last_name: str
    email_addresses: list[str]


async def get_user_by_id(user_id: str) -> User:
    """Get information about a user from their ID.

    Parameters
    ----------
    user_id:
        The ID of the user we are trying to look up

    Returns
    -------
    User
        Information about the user.

    Raises
    ------
    InvalidClerkAPIKeyError
        If the secret API key we are using is invalid.
    UserNotFoundError
        When the ID provided does not match any users in the database.
    """
    url = f"https://api.clerk.com/v1/users/{user_id}"
    headers = {"Authorization": f"Bearer {CLERK_SECRET_KEY}"}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

    # You can find the potential response status codes for Clerk here:
    # https://clerk.com/docs/reference/backend-api/tag/Users#operation/GetUser

    if response.status_code == 200:
        pass
    elif response.status_code == 401:
        assert "Authorization" in headers.keys(), headers.keys()
        raise InvalidClerkAPIKeyError()
    elif response.status_code == 400:
        # for debugging; I am not sure what to do in this scenario yet...
        assert False, response.json()
    elif response.status_code == 404:
        raise UserNotFoundError(user_id)
    else:
        assert False, f"unreachable ({response.status_code})"

    data: dict[str, object] = response.json()

    assert "id" in data.keys(), data.keys()
    id: str = data["id"]
    assert user_id == id, user_id + " != " + id

    assert "first_name" in data.keys(), data.keys()
    first_name: str = data["first_name"]

    assert "last_name" in data.keys(), data.keys()
    last_name: str = data["last_name"]

    assert "email_addresses" in data.keys(), data.keys()
    email_addresses_clerk: dict[str, object] = data["email_addresses"]
    assert len(email_addresses_clerk) > 0, len(email_addresses_clerk)
    # Clerk provides way more information about each email address
    # than we need, so here we are stripping out all extraneous information.
    # fmt: off
    assert "email_address" in email_addresses_clerk[0].keys(), email_addresses_clerk[0].keys()  # noqa: E501
    email_addresses: list[str] = [e["email_address"] for e in email_addresses_clerk]  # noqa: E501
    # fmt: on

    return User(
        id=id,
        first_name=first_name,
        last_name=last_name,
        email_addresses=email_addresses,
    )
