import { NextRequest, NextResponse } from "next/server";

import { createClerkClient } from "@clerk/nextjs/server";
import { ZodError, z } from "zod";

import { CLERK_SECRET_KEY } from "@/lib/env";
import { APIError } from "@/lib/errors";
import { isClerkError } from "@/lib/errors";
import { StatusCode } from "@/lib/http";

const UserSchema = z.object({
    first_name: z.string(),
    last_name: z.string().optional(),
    email_address: z.array(z.string()).nonempty(),
});

/**
 * An HTTP endpoint for creating new users.
 *
 * @example
 * // Create a new user
 * fetch("/api/users", {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify({
 *     first_name: "Nicolas",
 *     last_name: "Gonzalez",
 *     email_address: ["nicolasdgonzalez@proton.me"],
 *   }),
 * });
 */
export async function POST(request: NextRequest) {
    return request
        .json()
        .then((body) => UserSchema.parse(body))
        .then((payload) =>
            createClerkClient({ secretKey: CLERK_SECRET_KEY })
                .users.createUser({
                    firstName: payload.first_name,
                    lastName: payload.last_name,
                    emailAddress: payload.email_address,
                })
                .then((user) =>
                    NextResponse.json(
                        {
                            id: user.id,
                            first_name: user.firstName,
                            last_name: user.lastName,
                            email_addresses: user.emailAddresses,
                        },
                        {
                            status: StatusCode.CREATED,
                            headers: {
                                Location: `${request.nextUrl.pathname}/${user.id}`,
                            },
                        },
                    ),
                ),
        )
        .catch((error) => {
            const payload: APIError = { errors: [] };
            let status = StatusCode.INTERNAL_SERVER_ERROR;

            if (error instanceof SyntaxError) {
                payload.errors.push("expected request body to be valid JSON");
                status = StatusCode.BAD_REQUEST;
            } else if (isClerkError(error)) {
                for (let i = 0; i < error.errors.length; ++i) {
                    const e = error.errors[i];
                    payload.errors.push(`${e.message} (${e.code})`);

                    switch (e.code) {
                        case "form_identifier_exists":
                            status = StatusCode.CONFLICT;
                        default:
                            console.error(`missing status code: ${e.code}`);
                            status = StatusCode.INTERNAL_SERVER_ERROR;
                    }
                }
            } else if (error instanceof ZodError) {
                status = StatusCode.BAD_REQUEST;
                error.errors.forEach((issue) =>
                    payload.errors.push(`${issue.message} (${issue.code})`),
                );
            } else {
                payload.errors.push(JSON.stringify(error));
            }

            return NextResponse.json(payload, { status });
        });
}
