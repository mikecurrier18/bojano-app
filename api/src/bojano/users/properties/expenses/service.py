import datetime as dt
import logging

from bojano.expense_sheets.service import get_expense_sheet_id_by_year
from bojano.sheets import get_google_sheets_service
from bojano.users.properties.models import Property

from .models import Expense

log = logging.getLogger(__name__)


def convert_entry_to_expense(
    e: tuple[str, str, str, str, str, str, str], /
) -> Expense:
    # Table Headings:
    # [0]: Timestamp
    # [1]: ~~Date~~ (Timestamp displays same information)
    # [2]: ~~Property~~ (We already know the property's name)
    # [3]: Amount
    # [4]: Description
    # [5]: Receipt [Link]
    # [6]: Merchant
    # [7]: Name (Buyer's name)

    # The timestamp column does not follow a consistent format;
    # try each of format until one of them is successful.
    datetime_formats = (
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%S.%f%z",
        "%Y/%m/%d",
    )

    for fmt in datetime_formats:
        try:
            timestamp = dt.datetime.strptime(e[0], fmt)
        except ValueError:
            continue
        else:
            break
    else:
        raise RuntimeError(f"Failed to parse timestamp: {e[0]}")

    amount = float(e[3].replace("$", ""))
    description = e[4]
    receipt_link = e[5]
    merchant = e[6]
    buyers_name = e[7]

    return Expense(
        amount=amount,
        description=description,
        timestamp=timestamp,
        receipt_link=receipt_link,
        merchant=merchant,
        buyers_name=buyers_name,
    )


async def get_expenses_by_year(property: Property, year: int) -> list[Expense]:
    # NOTE: This can throw, but we don't want to handle it here.
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

    return list(
        map(
            convert_entry_to_expense,
            filter(
                lambda e: e[2].lower() == property.name.lower(),
                values,
            ),
        )
    )
