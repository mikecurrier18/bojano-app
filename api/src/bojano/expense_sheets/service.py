import logging

from bojano.database import db

from .exceptions import ExpenseSheetNotFoundError
from .models import ExpenseSheet

log = logging.getLogger(__name__)


async def get_expense_sheet_id_by_year(year: int) -> ExpenseSheet:
    collection = db["expense_sheet"]
    document = await collection.find_one({"year": year})

    if document is None:
        raise ExpenseSheetNotFoundError(year)

    assert "_id" in document, document.keys()
    expense_sheet = ExpenseSheet(id=document["_id"], year=year)
    return expense_sheet
