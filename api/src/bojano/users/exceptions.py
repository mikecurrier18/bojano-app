from bojano.exceptions import BojanoException


class UserNotFoundError(BojanoException):
    """The user ID provided does not match an existing user"""

    def __init__(self, user_id: str, *args: object) -> None:
        super().__init__(f"No user found with id {user_id!r}")
