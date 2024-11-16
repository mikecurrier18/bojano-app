import json

from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

from .config import SERVICE_ACCOUNT_KEY


def get_google_sheets_service() -> object:
    """Returns the object used to interact with the Google Sheets API.

    .. note::

        The library Google provides for Google Sheets does not provide type
        information, nor does Google provide very easy-to-understand
        documentation... luckily, our use case is rather simple, but if you
        want to try reading the documentation, you can find it here:
        https://developers.google.com/resources/api-libraries/documentation/sheets/v4/python/latest/index%2Ehtml

    Returns
    -------
    :class:`object` ...of what type? oh... if there's a way to figure that out,
    I haven't found it yet. Google provides a factory method that spits out
    an untyped client for the Sheets API. Refer to documentation.
    """
    service_account_info = json.loads(SERVICE_ACCOUNT_KEY)

    credentials = Credentials.from_service_account_info(
        service_account_info,
        scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"],
    )
    service = build("sheets", "v4", credentials=credentials)
    sheets = service.spreadsheets()
    return sheets
