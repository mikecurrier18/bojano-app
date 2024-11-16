from .. import exceptions as base_exceptions


class ExpenseSheetNotFoundError(base_exceptions.BojanoException):
    """No expense sheet exists for the year provided"""

    def __init__(self, year: int, *args: object) -> None:
        super().__init__("")
