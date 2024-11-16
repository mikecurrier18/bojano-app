import datetime as dt

import pydantic


class Expense(pydantic.BaseModel):
    # id: int  # TODO: This is for when the expenses are moved into a database.
    amount: float
    description: str
    timestamp: dt.datetime
    receipt_link: str
    merchant: str
    buyers_name: str
