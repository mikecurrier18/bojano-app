import { NextRequest, NextResponse } from "next/server";

import {
  clerkMiddleware,
  ClerkMiddlewareAuth,
  createRouteMatcher,
} from "@clerk/nextjs/server";

/**
 * We are using Clerk for user authentication. For more information,
 * @see https://clerk.com/docs/references/nextjs/clerk-middleware
 */

// These are routes that require users to be authenticated prior to entering.
const isProtectedRoute = createRouteMatcher([
  "/((?!sign-in|sign-up).*)",
]);

/**
 * @param auth TODO
 * @param request TODO
 */
async function handler(auth: ClerkMiddlewareAuth, request: NextRequest) {
  if (isProtectedRoute(request)) {
    // Asks the user to sign in if they are trying to access a protected route.
    await auth.protect();
  }

  const headers = new Headers(request.headers);
  // This is used to highlight which page the client is on in the Navbar.
  // This is a workaround for usePathname() being client-side only.
  headers.set("X-Current-Path", request.nextUrl.pathname);

  return NextResponse.next({ headers });
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
