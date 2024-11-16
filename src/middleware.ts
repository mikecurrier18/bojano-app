import { NextRequest } from "next/server";

import {
    ClerkMiddlewareAuth,
    clerkMiddleware,
    createRouteMatcher,
} from "@clerk/nextjs/server";

/**
 * We are using Clerk for user authentication. For more information,
 * @see https://clerk.com/docs/references/nextjs/clerk-middleware
 */

// These are routes that require users to be authenticated prior to entering.
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/forum(.*)"]);

/**
 * @param auth TODO
 * @param request TODO
 */
async function handler(auth: ClerkMiddlewareAuth, request: NextRequest) {
    if (isProtectedRoute(request)) {
        await auth.protect();
    }
}

export default clerkMiddleware(handler, { debug: false });

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
