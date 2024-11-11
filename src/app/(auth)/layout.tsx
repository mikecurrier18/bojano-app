import { PropsWithChildren } from "react";

/**
 * A component that wraps the content of all authentication-related routes.
 */
export default function Layout({ children }: PropsWithChildren) {
    return <main className="auth">{children}</main>;
}
