import pydantic


class ExpenseSheet(pydantic.BaseModel):
    id: str
    year: int
