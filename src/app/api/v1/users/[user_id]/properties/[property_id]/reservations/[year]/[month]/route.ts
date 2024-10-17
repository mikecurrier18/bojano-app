import { NextRequest, NextResponse } from "next/server";

import { createClerkClient } from "@clerk/nextjs/server";
import mongoose from "mongoose";

import {
    convertMMToFullMonthName,
    convertYearStringToInt,
} from "@/lib/api/date";
import { googleSheets } from "@/lib/api/sheets";
import { connectToDatabase } from "@/lib/database";
import { CLERK_SECRET_KEY } from "@/lib/env";
import {
    APIError,
    InvalidMonthError,
    InvalidYearError,
    SpreadsheetAccessError,
    SpreadsheetNotFoundError,
    isClerkError,
} from "@/lib/errors";
import { StatusCode } from "@/lib/http";
import { Spreadsheet } from "@/lib/models";

interface Params {
    params: {
        user_id: string;
        property_id: string;
        year: string;
        month: string;
    };
}

/**
 * An HTTP endpoint for getting a property's reservations for any given month.
 *
 * @example
 * // Get a list of reservations for any given month
 * fetch();
 */
export async function GET(_request: NextRequest, { params }: Params) {
    await connectToDatabase();

    return createClerkClient({ secretKey: CLERK_SECRET_KEY })
        .users.getUser(params.user_id)
        .then((_user) => {
            return Spreadsheet.findOne({
                // prettier-ignore
                property_id: new mongoose.Types.ObjectId(params.property_id),
                year: convertYearStringToInt(params.year),
            }).exec();
        })
        .then((spreadsheet) => {
            if (spreadsheet === null) {
                throw new SpreadsheetNotFoundError(params.property_id);
            }

            const sheetName = convertMMToFullMonthName(params.month);
            const sheets = googleSheets();
            return sheets.spreadsheets.values.get({
                // This is a dummy ID until I can get access to the actual
                // sheets...
                //
                // prettier-ignore
                spreadsheetId: "1L5n-ByJn5SGwJ-SOMjA3KGy7V8k8wR5DOCXJ5RtbpFs" ?? spreadsheet.id,
                range: `${sheetName}!A:G`,
                majorDimension: "ROWS",
            });
        })
        .then((response) => {
            if (response.status === 403) {
                // prettier-ignore
                throw new SpreadsheetAccessError(response.request.responseURL);
            }

            const rows = response.data.values ?? [];
            rows.shift(); // ignore table headings
            return rows.map((entry) => ({
                platform: entry[0],
                payout_date: new Date(entry[1]).toISOString(),
                check_in: new Date(entry[2]).toISOString(),
                check_out: new Date(entry[3]).toISOString(),
                revenue: entry[4],
                management_fee: entry[5],
                net_profit: entry[6],
            }));
        })
        .then((data) => NextResponse.json(data))
        .catch((error) => getErrorResponse(error));
}

function getErrorResponse(error: any): NextResponse {
    const payload: APIError = { errors: [] };
    let status = StatusCode.INTERNAL_SERVER_ERROR;

    if (isClerkError(error)) {
        status = StatusCode.NOT_FOUND;
        error.errors.forEach((e) =>
            payload.errors.push(`${e.longMessage} (${e.code})`),
        );
    } else if (error instanceof SpreadsheetNotFoundError) {
        status = StatusCode.NOT_FOUND;
        payload.errors.push(error.message);
    } else if (
        error instanceof InvalidYearError ||
        error instanceof InvalidMonthError
    ) {
        status = StatusCode.BAD_REQUEST;
        payload.errors.push(error.message);
    } else if (error instanceof SpreadsheetAccessError) {
        status = StatusCode.UNAUTHORIZED;
        payload.errors.push(error.message);
    } else {
        payload.errors.push(JSON.stringify(error));
    }

    return NextResponse.json(payload, { status });
}
