from ... import exceptions as base_exceptions


class PropertyNotFoundError(base_exceptions.BojanoException):
    """The property ID provided does not match an existing property"""

    def __init__(self, property_id: str, *args: object) -> None:
        super().__init__(f"No property found with id {property_id!r}")
