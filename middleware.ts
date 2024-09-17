import {
  clerkMiddleware,
  ClerkMiddlewareAuth,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Default API version to use when version is not specified.
 *
 * For example, assuming the current default API version is v1, navigating to
 * `/api/users/0/summary/2024` is identical to `/api/v1/users/0/summary/2024`.
 */
const DEFAULT_API_VERSION: number = 1;

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/forum(.*)"]);
const isApiRoute = createRouteMatcher(["/api/(.*)"]);

/**
 * @param {ClerkMiddlewareAuth} auth
 * @param {NextRequest} request
 */
function middlewareHandler(auth: ClerkMiddlewareAuth, request: NextRequest) {
  // If it's a protected route, enforce authentication
  if (isProtectedRoute(request)) {
    auth().protect();
  }

  /* Rewriting non-versioned API routes to use a default version */
  const url = request.nextUrl;

  /**
   * A regular expression to check if the URL includes an API version
   * (e.g., "/api/v1", "/api/v2", etc.). If not provided, rewrite the path
   * to use a default version instead
   */
  const versionRegex = /^\/api\/v\d+\/(.*)/;

  if (isApiRoute(request) && !versionRegex.test(url.pathname)) {
    const remainingPath = url.pathname.slice(5); // removes '/api/' prefix
    url.pathname = `/api/v${DEFAULT_API_VERSION}/${remainingPath}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export default clerkMiddleware(middlewareHandler);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
