import { NextRequest, NextResponse } from "next/server";

import { convertYearStringToInt } from "@/lib/api/date";
import { connectToDatabase } from "@/lib/database";
import { APIError, ExpenseSheetNotFoundError } from "@/lib/errors";
import { StatusCode } from "@/lib/http";
import { ExpenseSheet } from "@/lib/models/expense_sheet";

interface Params {
    params: {
        year: string;
    };
}

/**
 * An HTTP endpoint for getting the Spreadsheet ID of the annual expense sheet
 * for a given year.
 *
 * @example
 * // Returns the spreadsheet ID for the 2024 Expense Sheet
 * fetch(`/api/v1/expense_sheet/2024`)
 *     .then((payload) => console.log(payload.id))
 *     .catch((error) => error.errors.forEach((e) => console.error(e)));
 */
export async function GET(_request: NextRequest, { params }: Params) {
    await connectToDatabase();

    return ExpenseSheet.findOne({ year: convertYearStringToInt(params.year) })
        .exec()
        .then((expense_sheet) => {
            if (expense_sheet === null) {
                throw new ExpenseSheetNotFoundError(params.year);
            }

            return NextResponse.json({ id: expense_sheet._id });
        })
        .catch((error) => {
            const payload: APIError = { errors: [] };
            let status = StatusCode.INTERNAL_SERVER_ERROR;

            if (error instanceof ExpenseSheetNotFoundError) {
                status = StatusCode.NOT_FOUND;
                payload.errors.push(error.message);
            } else if (typeof error === "string") {
                payload.errors.push(error);
            } else {
                console.error(error);
                payload.errors.push(JSON.stringify(error));
            }

            return NextResponse.json(payload, { status });
        });
}
