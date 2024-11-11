__all__ = (
    "BojanoException",
    "InvalidClerkAPIKeyError",
    "UserNotFoundError",
)


class BojanoException(Exception):
    """The base exception for all Bojano-related errors"""


class InvalidClerkAPIKeyError(BojanoException):
    """Thrown when the Clerk API key we are using is invalid"""

    def __init__(self, *args: object) -> None:
        super().__init__(
            "api key for clerk is defined, but it is invalid. verify that "
            "the api key is correct, or go to the clerk dashboard and get "
            "a new one"
        )


class UserNotFoundError(BojanoException):
    """Thrown when the ID provided does not match an existing user"""

    def __init__(self, user_id: str, *args: object) -> None:
        super().__init__(f"no user found with id {user_id!r}")
