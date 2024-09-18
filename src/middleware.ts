import {
  clerkMiddleware,
  ClerkMiddlewareAuth,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/forum(.*)"]);

function middlewareHandler(auth: ClerkMiddlewareAuth, request: NextRequest) {
  if (isProtectedRoute(request)) {
    auth().protect();
  }
}

export default clerkMiddleware(middlewareHandler);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
