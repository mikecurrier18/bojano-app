import { google, sheets_v4 } from "googleapis";

var sheets: sheets_v4.Sheets | null = null;

/**
 * Connects to the Google Sheets API, and caches the session.
 */
export function googleSheets(force: boolean = false): sheets_v4.Sheets {
    if (!force && sheets !== null) {
        return sheets;
    }

    const auth = new google.auth.GoogleAuth({
        keyFile: "./service-account-key.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    sheets = google.sheets({ version: "v4", auth });
    return sheets;
}

type Summary = {
    platform: string;
    payout_date: string;
    check_in: string;
    check_out: string;
    revenue: string;
    fee: string;
    net_profit: string;
};

export type MonthlySummary = Summary[];

/**
 * Call the Google Sheets API to get the summary data for a given month.
 *
 * @example
 * // https://docs.google.com/spreadsheets/d/-->id<--/edit
 * const spreadsheetId = getSpreadsheetId();  // database call maybe
 * const data = monthlySummaryData(spreadsheetId, "2024", "02");
 */
export async function getMonthlySummary(
    spreadsheetId: string,
    sheetName: string,
): Promise<MonthlySummary> {
    const sheets = googleSheets();
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A2:G250`,
        majorDimension: "ROWS",
    });

    const data: Summary[] = [];
    const rows = response.data.values;

    // @ts-ignore
    for (let i = 0; i < rows.length; ++i) {
        // @ts-ignore
        const row = rows[i];

        data.push({
            platform: row[0],
            payout_date: row[1],
            check_in: row[2],
            check_out: row[3],
            revenue: row[4],
            fee: row[5],
            net_profit: row[6],
        });
    }

    return data;
}
