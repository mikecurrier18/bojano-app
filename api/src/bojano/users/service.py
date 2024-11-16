import httpx
from bojano.config import CLERK_SECRET_KEY
from bojano.exceptions import InvalidAPIKeyError

from .exceptions import UserNotFoundError
from .models import User


async def get_user_by_id(user_id: str) -> User:
    url = f"https://api.clerk.com/v1/users/{user_id}"
    headers = {"Authorization": f"Bearer {CLERK_SECRET_KEY}"}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

    # You can find the potential response status codes for Clerk here:
    # https://clerk.com/docs/reference/backend-api/tag/Users#operation/GetUser

    match response.status_code:
        case 200:
            pass
        case 400:
            raise RuntimeError(
                f"A bad request was sent to Clerk: {response.json()}"
            )
        case 401:
            assert "Authorization" in headers.keys(), headers.keys()
            raise InvalidAPIKeyError()
        case 404:
            raise UserNotFoundError(user_id)
        case _:
            # This should be unreachable (unless Clerk updated their API)
            assert False, f"{response.status_code}: {response.json()}"

    data: dict[str, object] = response.json()

    assert "id" in data.keys(), data.keys()
    id: str = data["id"]

    assert "first_name" in data.keys(), data.keys()
    first_name: str = data["first_name"]

    assert "last_name" in data.keys(), data.keys()
    last_name: str = data["last_name"]

    assert "email_addresses" in data.keys(), data.keys()
    email_addresses = list(
        map(lambda e: e["email_address"], data["email_addresses"])
    )

    return User(
        id=id,
        first_name=first_name,
        last_name=last_name,
        email_addresses=email_addresses,
    )
