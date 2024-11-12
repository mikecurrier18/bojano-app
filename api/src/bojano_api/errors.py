__all__ = (
    "BojanoException",
    "MissingEnvironmentVariableError",
    "InvalidClerkAPIKeyError",
    "UserNotFoundError",
    "PropertyNotFoundError",
)


class BojanoException(Exception):
    """The base exception for all Bojano-related errors"""


class MissingEnvironmentVariableError(BojanoException):
    """Thrown when an environment variable was expected, but not defined"""

    def __init__(self, key: str, *args: object) -> None:
        super().__init__(
            f"expected environment variable {key!r} to be defined"
        )


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


class PropertyNotFoundError(BojanoException):
    """Thrown when the ID provided does not match an existing property"""

    def __init__(self, property_id: str, *args: object) -> None:
        super().__init__(f"no property found with id {property_id!r}")
