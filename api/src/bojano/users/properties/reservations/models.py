import datetime as dt

import pydantic


class Reservation(pydantic.BaseModel):
    platform: str
    check_in: dt.datetime
    check_out: dt.datetime
    revenue: float
    management_fee: float
    net_profit: float
