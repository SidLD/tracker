import { TooltipProvider } from "@/components/ui/tooltip";
import "@/styles/globals.css";
import { type Metadata } from "next";
import React from 'react'

import NavigationHeader from "./_components/navigation-header";
import NavigationSheet from "./_components/navigation-sheet";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Tracker",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
      <TooltipProvider>    
        <Toaster />
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <NavigationHeader />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <NavigationSheet />
              {children}
          </div>
        </div>
      </TooltipProvider>
  );
}