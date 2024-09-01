import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import SessionProviderWrapper from "@/lib/SessionProviderWrapper";
import { TRPCReactProvider } from "@/trpc/react";
export const metadata: Metadata = {
  title: "Tracker",
  description: "Employee Tracker",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
            <SessionProviderWrapper>
              {children}
            </SessionProviderWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
