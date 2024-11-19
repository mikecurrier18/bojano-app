import datetime as dt
import logging

from bojano.expense_sheets.service import get_expense_sheet_id_by_year
from bojano.sheets import get_google_sheets_service
from bojano.users.properties.models import Property
from bojano.utils import normalize_price

from .models import Expense

log = logging.getLogger(__name__)

# The timestamp column does not follow a consistent format;
# try each of format until one of them is successful.
DATETIME_FORMATS = (
    "%Y-%m-%d %H:%M:%S",
    "%Y-%m-%dT%H:%M:%S%z",
    "%Y-%m-%dT%H:%M:%S.%f%z",
    "%Y-%m-%d",
    "%Y/%m/%d",
    "%m/%d/%y",
)


async def get_expenses_by_year(property: Property, year: int) -> list[Expense]:
    expense_sheet = await get_expense_sheet_id_by_year(year)
    spreadsheet_id = expense_sheet.id

    sheets = get_google_sheets_service()
    response = (
        sheets.values()
        .get(spreadsheetId=spreadsheet_id, range="Expenses!A:H")
        .execute()
    )
    values = response.get("values", [])
    _ = values.pop(0)  # table headings

    # Table Headings:
    # [0]: Timestamp
    # [1]: Date
    # [2]: Property
    # [3]: Amount
    # [4]: Description
    # [5]: Receipt [Link]
    # [6]: Merchant
    # [7]: Name (Buyer's name)
    entries = filter(lambda e: e[2].lower() == property.name.lower(), values)
    expenses: list[Expense] = []

    for entry in entries:
        for fmt in DATETIME_FORMATS:
            try:
                timestamp = dt.datetime.strptime(entry[0], fmt)
            except ValueError:
                continue
            else:
                break
        else:
            raise RuntimeError(f"Failed to parse timestamp: {entry[0]}")

        amount = float(normalize_price(entry[3]))
        description = entry[4]
        receipt_link = entry[5]
        merchant = entry[6]
        buyers_name = entry[7]

        expense = Expense(
            property_id=property.id,
            amount=amount,
            description=description,
            timestamp=timestamp,
            receipt_link=receipt_link,
            merchant=merchant,
            buyers_name=buyers_name,
        )

        expenses.append(expense)

    return expenses


async def get_expenses_by_month(
    property: Property,
    year: int,
    month: int,
) -> list[Expense]:
    annual_expenses = await get_expenses_by_year(property, year)
    return list(filter(lambda e: e.timestamp.month == month, annual_expenses))
