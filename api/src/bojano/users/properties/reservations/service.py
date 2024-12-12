import datetime as dt
from typing import Literal

from bojano.database import db
from bojano.sheets import get_google_sheets_service
from bojano.users.properties.models import Property
from bojano.utils import normalize_price
from bson.objectid import ObjectId

from .exceptions import InvalidMonthError
from .models import Reservation

FullMonthName = Literal[
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

DATE_FORMAT = "%m/%d/%Y"


async def convert_int_month_to_full_month_name(month: int) -> FullMonthName:
    if 1 < month > 12:
        raise InvalidMonthError(month)

    match month:
        case 1:
            return "January"
        case 2:
            return "February"
        case 3:
            return "March"
        case 4:
            return "April"
        case 5:
            return "May"
        case 6:
            return "June"
        case 7:
            return "July"
        case 8:
            return "August"
        case 9:
            return "September"
        case 10:
            return "October"
        case 11:
            return "November"
        case 12:
            return "December"


async def get_reservations_for_month(
    property: Property,
    year: int,
    month: FullMonthName,
) -> list[Reservation]:
    collection = db["spreadsheet"]
    response = await collection.find_one(
        {"property_id": ObjectId(property.id), "year": year}
    )
    spreadsheet_id = response.get("_id")

    sheets = get_google_sheets_service()
    response = (
        sheets.values()
        .get(spreadsheetId=spreadsheet_id, range=f"{month}!A:G")
        .execute()
    )
    values = response.get("values", [])
    _ = values.pop(0)  # table headings

    # Table Headings:
    # [0]: Platform
    # [1]: Date Paid Out
    # [2]: Check-in
    # [3]: Check-out
    # [4]: Revenue
    # [5]: Management Fee
    # [6]: Net Profit
    entries = filter(lambda e: e[0] != "", values)

    reservations: list[Reservation] = []

    for entry in entries:
        platform = entry[0].lower()
        payout_date = dt.datetime.strptime(entry[1], DATE_FORMAT)
        check_in = dt.datetime.strptime(entry[2], DATE_FORMAT)
        check_out = dt.datetime.strptime(entry[3], DATE_FORMAT)
        revenue = float(normalize_price(entry[4]))

        try:
            management_fee = float(normalize_price(entry[5]))
        except ValueError:
            management_fee = 0.0

        net_profit = float(normalize_price(entry[6]))

        reservation = Reservation(
            platform=platform,
            payout_date=payout_date,
            check_in=check_in,
            check_out=check_out,
            revenue=revenue,
            management_fee=management_fee,
            net_profit=net_profit,
        )

        reservations.append(reservation)

    return reservations
