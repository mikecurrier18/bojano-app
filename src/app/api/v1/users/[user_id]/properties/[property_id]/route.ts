import { NextRequest, NextResponse } from "next/server";

import { createClerkClient } from "@clerk/nextjs/server";

import { connectToDatabase } from "@/lib/database";
import { CLERK_SECRET_KEY } from "@/lib/env";
import { APIError } from "@/lib/errors";
import { PropertyNotFoundError, isClerkError } from "@/lib/errors";
import { StatusCode } from "@/lib/http";
import { Property } from "@/lib/models";

interface Params {
    params: {
        user_id: string;
        property_id: string;
    };
}

export async function GET(_request: NextRequest, { params }: Params) {
    await connectToDatabase();
    return createClerkClient({ secretKey: CLERK_SECRET_KEY })
        .users.getUser(params.user_id)
        .then((_user) => Property.findById(params.property_id).exec())
        .then((property) => {
            if (property === null) {
                throw new PropertyNotFoundError(params.property_id);
            }

            return NextResponse.json({
                id: property._id,
                name: property.name,
            });
        })
        .catch((error) => {
            const payload: APIError = { errors: [] };
            let status = StatusCode.INTERNAL_SERVER_ERROR;

            if (isClerkError(error)) {
                status = StatusCode.NOT_FOUND;
                error.errors.forEach((e) =>
                    payload.errors.push(`${e.longMessage} (${e.code})`),
                );
            } else if (error instanceof PropertyNotFoundError) {
                status = StatusCode.NOT_FOUND;
                payload.errors.push(error.message);
            } else {
                payload.errors.push(JSON.stringify(error));
            }

            return NextResponse.json(payload, { status });
        });
}
