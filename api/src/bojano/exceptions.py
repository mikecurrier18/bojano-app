__all__ = (
    "BojanoException",
    "InvalidAPIKeyError",
    "MissingEnvironmentVariableError",
)


class BojanoException(Exception):
    """The base exception of all Bojano-related exceptions"""


class InvalidAPIKeyError(BojanoException):
    """The API key used was rejected by the service it was trying to access"""

    def __init__(self, *args: object) -> None:
        super().__init__("The API key used for this request was invalid")


class MissingEnvironmentVariableError(BojanoException):
    """Expected an environment variable to be defined, but it wasn't"""

    def __init__(self, key: str, *args: object) -> None:
        super().__init__(f"Expected environment variable {key} to be defined")
