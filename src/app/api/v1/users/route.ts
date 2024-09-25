import { NextRequest, NextResponse } from "next/server";

import { createClerkClient } from "@clerk/nextjs/server";
import assert from "assert";
import { ZodError, z } from "zod";

import { CLERK_SECRET_KEY } from "@/lib/env";
import { StatusCode } from "@/lib/http";

const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY });

/**
 * Expected format for incoming POST requests when creating new user accounts.
 *
 * The field names match the names used by Clerk in the JS Backend SDK.
 * https://clerk.com/docs/references/backend/user/create-user
 */
const User = z.object({
    firstName: z.string(),
    lastName: z.string().optional(),
    emailAddress: z.array(z.string()).nonempty(),
    phoneNumber: z.array(z.string()).optional(),
});

// TODO: `Authorization: Basic <key>`, and set up a way to get an API key

/**
 * An HTTP endpoint for creating new user accounts.
 *
 * @example <caption>POST /api/v1/users</caption>
 * {
 *   "firstName": "Nic",
 *   "lastName": "Gonzalez",
 *   "emailAddress": ["nicolasdgonzalez@proton.me"]
 * }
 */
export async function POST(request: NextRequest) {
    try {
        var body = await request.json();
    } catch (error) {
        assert(error instanceof SyntaxError, JSON.stringify(error));
        return NextResponse.json(
            { errors: ["expected request body to be valid JSON"] },
            { status: StatusCode.BAD_REQUEST },
        );
    }

    try {
        var data = User.parse(body);
    } catch (error) {
        assert(error instanceof ZodError, JSON.stringify(error));
        // TODO: Convert Zod error to our typical error format
        // https://zod.dev/ERROR_HANDLING
        console.error(JSON.stringify(error));
        return NextResponse.json(
            { errors: ["an error occurred while parsing request body"] },
            { status: StatusCode.BAD_REQUEST },
        );
    }

    try {
        var user = await clerkClient.users.createUser(data);
    } catch (error) {
        /**
         * Because ClerkAPIError is an interface, we can't do much to validate
         * that the correct object is here. We'll proceed on the assumption
         * that only `ClerkAPIError`s will be thrown from the try block...
         * https://clerk.com/docs/references/javascript/types/clerk-api-error
         */

        // @ts-expect-error
        assert("code" in error && "message" in error, JSON.stringify(error));
        const errors = [];
        let status = StatusCode.BAD_REQUEST;

        switch (error.code) {
            case "form_identifier_exists":
                // thrown when the email address provided is already in use
                status = StatusCode.CONFLICT;
                errors.push(error.message);
            default:
                errors.push(`clerk error: ${error.code}: ${error.message}`);
        }

        return NextResponse.json({ errors }, { status });
    }

    return NextResponse.json(
        { data: user },
        {
            status: StatusCode.CREATED,
            headers: { Location: `${request.nextUrl.basePath}/${user.id}` },
        },
    );
}
