import { NextRequest, NextResponse } from "next/server";

import { createClerkClient } from "@clerk/nextjs/server";
import { ZodError, z } from "zod";

import { connectToDatabase } from "@/lib/database";
import { CLERK_SECRET_KEY } from "@/lib/env";
import { APIError } from "@/lib/errors";
import { isClerkError } from "@/lib/errors";
import { StatusCode } from "@/lib/http";
import { Property } from "@/lib/models";

interface Params {
    params: {
        user_id: string;
    };
}

const PropertySchema = z.object({
    name: z.string(),
    airbnb_id: z.string().optional(),
    vrbo_id: z.string().optional(),
});

/**
 * An HTTP endpoint for creating new properties.
 *
 * @example
 * // Create a new property
 * fetch(`/api/users/${userId}/properties`, {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify({
 *     name: "My New Property",
 *   }),
 * });
 */
export async function POST(request: NextRequest, { params }: Params) {
    await connectToDatabase();

    return createClerkClient({ secretKey: CLERK_SECRET_KEY })
        .users.getUser(params.user_id)
        .then((user) =>
            request
                .json()
                .then((body) => PropertySchema.parse(body))
                .then((payload) =>
                    Property.create({ user_id: user.id, ...payload }),
                ),
        )
        .then((property) =>
            NextResponse.json(
                {
                    id: property._id,
                    name: property.name,
                },
                {
                    status: StatusCode.CREATED,
                    headers: {
                        Location: `${request.nextUrl.pathname}/${property._id}`,
                    },
                },
            ),
        )
        .catch((error) => {
            const payload: APIError = { errors: [] };
            let status = StatusCode.INTERNAL_SERVER_ERROR;

            if (isClerkError(error)) {
                status = StatusCode.NOT_FOUND;
                error.errors.forEach((e) =>
                    payload.errors.push(`${e.longMessage} (${e.code})`),
                );
            } else if (error instanceof SyntaxError) {
                status = StatusCode.BAD_REQUEST;
                payload.errors.push("expected request body to be valid JSON");
            } else if (error instanceof ZodError) {
                status = StatusCode.BAD_REQUEST;
                error.issues.forEach((issue) =>
                    payload.errors.push(`${issue.message} (${issue.code})`),
                );
            } else {
                payload.errors.push(JSON.stringify(error));
            }

            return NextResponse.json(payload, { status });
        });
}

/**
 * An HTTP endpoint for getting all of a user's properties.
 *
 * @example
 * // Returns a list of all the user's properties
 * fetch(`/api/v1/users/${userId}/properties`)
 *     .then((payload) => console.log(payload))
 *     .catch((error) => console.error(error))
 */
export async function GET(_request: NextRequest, { params }: Params) {
    await connectToDatabase();

    return createClerkClient({ secretKey: CLERK_SECRET_KEY })
        .users.getUser(params.user_id)
        .then((user) => {
            console.log(user.id);
            return Property.find({ user_id: user.id }).exec();
        })
        .then((data) =>
            data === null
                ? []
                : data.map((property) => ({
                      id: property._id,
                      name: property.name,
                  })),
        )
        .then((properties) => NextResponse.json(properties))
        .catch((error) => {
            const payload: APIError = { errors: [] };
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
