import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import Top from "@/components/shared/Top";
const IBMPlex = IBM_Plex_Sans({ subsets: ["latin"],
weight: ['400', '500', '600', '700',],
variable: '--font-ibm-plex' 
});

export const metadata: Metadata = {
  title: "Bojano Homes Owner Portal",
  description: "Bojano Homes Owner Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={cn("font-IBMPlex antialiased", IBMPlex.variable)}>

        <Top/>
        
        {children}
        </body>
    </html>
    </ClerkProvider>
  );
}