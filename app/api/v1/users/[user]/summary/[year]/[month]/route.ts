import { NextResponse } from "next/server";
import { google } from "googleapis";

/**
 * padding the array with an extra value so the array can be 1 based, indexes
 * should be validated prior to accessing this array to ensure index 0 is
 * always unreachable
 */
const MONTHS = [
  "UNREACHABLE",
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
];

type Params = {
  params: {
    user: string;
    year: string;
    month: string;
  };
};

/**
 * Get a user's monthly summary.
 *
 * @param {Request} request
 * @param {Params} params
 */
export async function GET(request: Request, { params }: Params) {
  // todo: validate user. how are we identifying users? email? uuid?
  console.error("user has not been validated (not implemented)");

  const year = validateYearParam(params.year);

  if (year instanceof NextResponse) {
    return year;
  }

  const month = validateMonthParam(params.month);

  if (month instanceof NextResponse) {
    return month;
  }

  // todo: use Google API to search Google Sheets for the user's data
  const spreadsheetId = "[redacted]";
  const sheetName = monthNumberToString(month);
  const data = monthlySummaryData(spreadsheetId, sheetName);

  if (!data) {
    return NextResponse.json(
      { error: "No data found for the provided year" },
      { status: 404 },
    );
  }

  return NextResponse.json(data, { status: 200 });
}

/**
 * Convert year into a base 10 number, or return a `400: Bad Request`.
 *
 * @param {string} year
 *
 * @returns {(number|NextResponse)}
 */
function validateYearParam(year: string): number | NextResponse {
  const value = parseInt(year, 10);

  if (isNaN(value) || year.length !== 4) {
    return NextResponse.json(
      { error: "year should be in 4-digit YYYY format" },
      { status: 400 },
    );
  }

  const currentYear = new Date().getFullYear();

  if (value > currentYear) {
    return NextResponse.json(
      { error: `year should be less than or equal to ${currentYear}` },
      { status: 400 },
    );
  }

  return value;
}

/**
 * Convert month into a base 10 number, or return a `400: Bad Request`.
 *
 * @param {string} month
 *
 * @returns {(number|NextResponse)}
 */
function validateMonthParam(month: string): number | NextResponse {
  const value = parseInt(month, 10);

  if (isNaN(value) || month.length !== 2) {
    return NextResponse.json(
      { error: "month should be in 2-digit MM format" },
      { status: 400 },
    );
  }

  if (value < 1 || value > 12) {
    return NextResponse.json(
      { error: "month should be between 01 and 12 (inclusive)" },
      { status: 400 },
    );
  }

  return value;
}

function monthNumberToString(month: number): string {
  if (month < 1 || month > MONTHS.length - 1) {
    throw new Error("month should be between 1 and 12 (inclusive)");
  }

  return MONTHS[month];
}

/**
 * Call the Google Spreadsheets API to get the summary data for a given month.
 *
 * @param {string} spreadsheetId - The ID of the Spreadsheet you want to read
 * @param {string} sheetName - The page of the spreadsheet to read (e.g. Overviews,
 *                         Profit Summary, January, February, etc.)
 *
 * @example
 * // https://docs.google.com/spreadsheets/d/<id>/edit
 * const spreadsheetId = "<id>";
 * const sheetName = "January";
 * const data = monthlySummaryData(spreadsheetId, sheetName);
 */
async function monthlySummaryData(spreadsheetId: string, sheetName: string) {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./service-account-key.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `${sheetName}!J2:K7`, // todo: this should be dynamic... but how?
  });

  const rows = response.data.values;
  console.log(rows);
}
