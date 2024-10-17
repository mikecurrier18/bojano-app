import { NextRequest, NextResponse } from "next/server";

import { createClerkClient } from "@clerk/nextjs/server";

import { CLERK_SECRET_KEY } from "@/lib/env";
import { APIError } from "@/lib/errors";
import { isClerkError } from "@/lib/errors";
import { StatusCode } from "@/lib/http";

interface Params {
    params: {
        user_id: string;
    };
}

export async function GET(_request: NextRequest, { params }: Params) {
    return createClerkClient({ secretKey: CLERK_SECRET_KEY })
        .users.getUser(params.user_id)
        .then((user) =>
            NextResponse.json({
                id: user.id,
                first_name: user.firstName,
                last_name: user.lastName,
                email_addresses: user.emailAddresses.map(
                    (email) => email.emailAddress,
                ),
            }),
        )
        .catch((error) => {
            const payload: APIError = {
                errors: [],
            };
            let status = StatusCode.INTERNAL_SERVER_ERROR;

            if (isClerkError(error)) {
                status = StatusCode.NOT_FOUND;
                error.errors.forEach((e) =>
                    payload.errors.push(`${e.longMessage} (${e.code})`),
                );
            } else {
                payload.errors.push(JSON.stringify(error));
            }
            return NextResponse.json(payload, { status });
        });
}
