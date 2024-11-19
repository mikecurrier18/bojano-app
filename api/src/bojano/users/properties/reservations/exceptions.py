from bojano.exceptions import BojanoException


class InvalidMonthError(BojanoException):
    def __init__(self, month: int, *args: object) -> None:
        super().__init__(
            f"Invalid month {month}. Value should be an integer "
            "between 1 and 12 (inclusive)."
        )
