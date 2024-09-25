import { NextRequest, NextResponse } from "next/server";

import { createClerkClient } from "@clerk/nextjs/server";
import assert from "assert";

import { CLERK_SECRET_KEY } from "@/lib/env";
import { StatusCode } from "@/lib/http";

type RouteParameters = {
    params: {
        user: string;
    };
};

const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY });

export async function GET(request: NextRequest, { params }: RouteParameters) {
    try {
        var user = await clerkClient.users.getUser(params.user);
    } catch (error) {
        // @ts-expect-error
        assert("code" in error && "message" in error, JSON.stringify(error));
        const errors = [];

        switch (error.code) {
            case "resource_not_found":
                errors.push(error.message);
            default:
                errors.push(`clerk error: ${error.code}: ${error.message}`);
        }

        console.error(JSON.stringify(error));
        return NextResponse.json(
            { errors },
            { status: StatusCode.BAD_REQUEST },
        );
    }

    return NextResponse.json({ data: user });
}
