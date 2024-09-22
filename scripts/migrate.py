#!/usr/bin/python

"""
Migrate existing user/property information from Google Sheets to MongoDB.
"""

import csv
import os
import pathlib
import re
from typing import TypedDict, cast

import pymongo
import snowflake
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

current_dir = pathlib.Path(__file__).parent

try:
    import dotenv
except ImportError:
    pass  # if dotenv isn't available, we skip loading the .env file
else:
    env_file = current_dir.joinpath(".env")
    _ = dotenv.load_dotenv(env_file)

if (MONGODB_URI := os.environ.get("MONGODB_URI")) is None:
    raise KeyError("environment variable 'MONGODB_URI' should be defined")

RawHomeownerData = TypedDict(
    "RawHomeownerData",
    {
        "Property Owner": str,
        "Commission Percentage": str,
        "Nightly vs. Gross": str,
        "Payout timing": str,
        "Notification Limit": str,
        "Email": str,
        "Google Drive Folders": str,
        "Link here": str,
        "All Props": str,
        "Individual 1": str,
        "Individual 2": str,
        "Individual 3": str,
        "Individual 4": str,
        "Individual 5": str,
        "Individual 6": str,
        "Individual 7": str,
        "Individual 8": str,
        "Individual 9": str,
        "Individual 10": str,
    },
)


class User(TypedDict):
    _id: str
    name: str
    email: list[str]


class Property(TypedDict):
    _id: str
    user_id: str
    name: str


class Spreadsheet(TypedDict):
    _id: str
    property_id: str
    year: int


def extract_id_from_spreadsheet_link(link: str) -> str | None:
    pattern = r"^https://docs.google.com/spreadsheets/d/(?P<id>.*)/edit.*$"
    match = re.match(pattern, link)

    if match is None:
        return None

    return match.group("id")


def main() -> None:
    """The main entry point to the program"""
    csv_file = current_dir.joinpath("homeowners.csv")

    if not csv_file.exists():
        raise FileNotFoundError(
            f"export spreadsheet 'All Homeowners' in CSV format to: {csv_file}"
        )

    client: pymongo.MongoClient = pymongo.MongoClient(MONGODB_URI)
    database = client.get_database("LAB")

    snowflake_gen = snowflake.SnowflakeGenerator(24)
    user_entries: list[User] = []
    property_data: list[tuple[str, str]] = []

    with open(csv_file, "r") as f:
        reader = csv.DictReader(f)

        for row in reader:
            if row.get("Property Owner") == "":
                continue

            data: RawHomeownerData = cast(RawHomeownerData, dict(row))
            user_entry = User(
                _id=str(next(snowflake_gen)),
                name=data["Property Owner"],
                email=[e.strip() for e in data.get("Email", "").split(",")],
            )
            user_entries.append(user_entry)

            # capturing additional information that we'll use later
            property_data.append((data["Property Owner"], data["All Props"]))

    user_collection = database.get_collection("user")
    _ = user_collection.insert_many(user_entries)

    service_account_key = current_dir.joinpath("service-account-key.json")
    credentials = Credentials.from_service_account_file(  # type: ignore
        service_account_key,
        scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"],
    )
    service = build("sheets", "v4", credentials=credentials)
    sheets = service.spreadsheets()

    property_collection = database.get_collection("property")
    spreadsheet_collection = database.get_collection("spreadsheet")

    for homeowner, all_properties_link in property_data:
        if all_properties_link == "":
            continue  # ignore if the user has no properties

        spreadsheet_id = extract_id_from_spreadsheet_link(all_properties_link)
        result = (
            sheets.values()
            .get(spreadsheetId=spreadsheet_id, range="Information!B:C")
            .execute()
        )
        values = result.get("values", [])
        assert len(values) > 0 and values[0][0] == homeowner
        _, _ = values.pop(0)  # table headings

        user = user_collection.find_one({"name": homeowner})

        for row in values:
            if len(row) != 2 or any((value == "" for value in row)):
                continue  # missing either spreadsheet ID or property name

            property_link, property_name = row
            user_id = user.get("_id")

            property_entry = Property(
                _id=str(next(snowflake_gen)),
                user_id=user_id,
                name=property_name,
            )

            property_id = extract_id_from_spreadsheet_link(property_link)
            spreadsheet_entry = Spreadsheet(
                _id=property_id,
                property_id=property_entry["_id"],
                # `year` cannot be determined from the sheets alone, but I know
                # it's supposed to be 2024 so it's hardcoded in there. This
                # needs to change eventually, otherwise this code can't be used
                # after the start of 2025 (though, hopefully in 2025 we no
                # longer rely solely on Google Sheets...)
                year=2024,
            )

            property = property_collection.find_one(
                {
                    "user_id": property_entry["user_id"],
                    "name": property_entry["name"],
                }
            )

            if property is None:
                property_collection.insert_one(property_entry)

            spreadsheet = spreadsheet_collection.find_one(
                {"_id": spreadsheet_entry["_id"]}
            )

            if spreadsheet is None:
                spreadsheet_collection.insert_one(spreadsheet_entry)


if __name__ == "__main__":
    main()
