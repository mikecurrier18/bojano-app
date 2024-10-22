import { NextRequest, NextResponse } from "next/server";

import { ZodError, z } from "zod";

import { APIError, InvalidYearError } from "@/lib/errors";
import { StatusCode } from "@/lib/http";
import { ExpenseSheet } from "@/lib/models/expense_sheet";

const ExpenseSheetSchema = z.object({
    spreadsheet_id: z.string(),
    year: z.number(),
});

export async function POST(request: NextRequest) {
    return request
        .json()
        .then((body) => ExpenseSheetSchema.parse(body))
        .then((payload) =>
            ExpenseSheet.create({
                _id: payload.spreadsheet_id,
                year: payload.year,
            }),
        )
        .then((expense_sheet) =>
            NextResponse.json(
                {
                    id: expense_sheet._id,
                    year: expense_sheet.year,
                },
                {
                    status: StatusCode.CREATED,
                    headers: {
                        Location: `${request.nextUrl.pathname}/${expense_sheet.year}`,
                    },
                },
            ),
        )
        .catch((error) => getErrorResponse(error));
}

function getErrorResponse(error: any): NextResponse {
    const payload: APIError = { errors: [] };
    let status = StatusCode.INTERNAL_SERVER_ERROR;

    if (error instanceof SyntaxError) {
        status = StatusCode.BAD_REQUEST;
        payload.errors.push("expected request body to be valid JSON");
    } else if (error instanceof ZodError) {
        status = StatusCode.BAD_REQUEST;
        error.errors.forEach((issue) =>
            payload.errors.push(`${issue.message} (${issue.code})`),
        );
    } else if (error instanceof InvalidYearError) {
        status = StatusCode.BAD_REQUEST;
        payload.errors.push(error.message);
    } else if (typeof error === "string") {
        payload.errors.push(error);
    } else {
        payload.errors.push(JSON.stringify(error));
    }

    return NextResponse.json(payload, { status });
}
