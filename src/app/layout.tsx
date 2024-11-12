import { IBM_Plex_Sans } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";

import Top from "@components/shared/Top";
import { cn } from "@lib/utils";

import "./globals.css";

const IBMPlex = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-ibm-plex",
});

export const metadata: Metadata = {
    title: "Dashboard | Bojano Homes",
    description: "View detailed information about your properties.",
};

/**
 * A component that wraps the content of every route.
 */
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body
                    className={cn(
                        "font-IBMPlex antialiased",
                        IBMPlex.variable,
                    )}
                >
                    <Top />

                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
