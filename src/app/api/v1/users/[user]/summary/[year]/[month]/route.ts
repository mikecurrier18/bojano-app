import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

import { StatusCode } from "@/lib/http";

type RouteParams = {
  params: {
    user: string;
    year: string;
    month: string;
  };
};

/**
 * API endpoint for getting a user's monthly summary.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const user = getUser(params.user);
  console.error("user validation has not been implemented yet");

  try {
    var year = validateYearParam(params.year);
  } catch (error) {
    if (error instanceof InvalidYearError) {
      return NextResponse.json(
        { error: error.message },
        { status: StatusCode.BAD_REQUEST },
      );
    } else {
      return NextResponse.json(
        { error: "an error occurred while parsing year" },
        { status: StatusCode.INTERNAL_SERVER_ERROR },
      );
    }
  }

  try {
    var month = handleMonthParam(params.month);
  } catch (error) {
    if (error instanceof InvalidMonthError) {
      return NextResponse.json(
        { error: error.message },
        { status: StatusCode.BAD_REQUEST },
      );
    } else {
      return NextResponse.json(
        { error: "an error occurred while parsing year" },
        { status: StatusCode.INTERNAL_SERVER_ERROR },
      );
    }
  }

  const spreadsheetId = getSpreadsheetId(user, year);
  const sheetName = month;

  try {
    var data = await getMonthlySummary(spreadsheetId, sheetName);
  } catch (error) {
    if (error instanceof BojanoException) {
      console.error(error.message);
      return NextResponse.json(
        { error: error.message },
        { status: StatusCode.BAD_REQUEST },
      );
    } else {
      console.error("unknown error has occurred: %s", error);
      return NextResponse.json(
        { error: error },
        { status: StatusCode.INTERNAL_SERVER_ERROR },
      );
    }
  }

  return NextResponse.json({ data }, { status: StatusCode.OK });
}

type User = unknown;

/**
 * Get information about a user.
 */
function getUser(user: string): User {
  console.warn("not implemented");
  return user;
}

/**
 * Ensure the year provided is 4 digits long, and is not greater than
 * the current year.
 */
function validateYearParam(year: string): string {
  const value = parseInt(year, 10);

  if (isNaN(value) || year.length !== 4) {
    throw new InvalidYearError("year should be in 4-digit YYYY format");
  }

  const currentYear = new Date().getFullYear();

  if (value > currentYear) {
    throw new InvalidYearError(
      `year should be less than or equal to ${currentYear}`,
    );
  }

  return year;
}

/**
 * Convert the 2-digit, MM formated month into its full month name.
 */
function handleMonthParam(month: string) {
  switch (month) {
    case "01":
      return "January" as const;
    case "02":
      return "February" as const;
    case "03":
      return "March" as const;
    case "04":
      return "April" as const;
    case "05":
      return "May" as const;
    case "06":
      return "June" as const;
    case "07":
      return "July" as const;
    case "08":
      return "August" as const;
    case "09":
      return "September" as const;
    case "10":
      return "October" as const;
    case "11":
      return "November" as const;
    case "12":
      return "December" as const;
    default:
      throw new InvalidMonthError(
        "month should be a 2-digit string between 01 and 12 (inclusive)",
      );
  }
}

function getSpreadsheetId(user: User, year: string) {
  // TODO: dummy id (for dummies)
  return "1Ao5xHqq1Y_DlwaitYLgMXR91j1WZDLTS5yx9FqnUWgs";
}

type Summary = {
  platform: string;
  payOutDate: string;
  checkIn: string;
  checkOut: string;
  revenue: string;
  fee: string;
  netProfit: string;
};

/**
 * Call the Google Sheets API to get the summary data for a given month.
 *
 * @example
 * // https://docs.google.com/spreadsheets/d/-->id<--/edit
 * const spreadsheetId = "";
 * const sheetName = "January";
 * const data = monthlySummaryData(spreadsheetId, sheetName);
 */
async function getMonthlySummary(spreadsheetId: string, sheetName: string) {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./service-account-key.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:G250`,
    majorDimension: "ROWS",
  });

  var data: Summary[] = [];
  const rows = response.data.values as string[][];

  for (let i = 0; i < rows.length; ++i) {
    const row = rows[i];
    data.push({
      platform: row[0],
      payOutDate: row[1],
      checkIn: row[2],
      checkOut: row[3],
      revenue: row[4],
      fee: row[5],
      netProfit: row[6],
    });
  }

  return data;
}
