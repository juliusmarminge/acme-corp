import "@acme/ui/styles.css";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs/app-beta";
import { Analytics } from "@vercel/analytics/react";

import { cn } from "@acme/ui";
import { Toaster } from "@acme/ui/toaster";

import { SiteFooter } from "~/components/footer";
import { TailwindIndicator } from "~/components/tailwind-indicator";
import { ThemeProvider } from "~/components/theme-provider";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning className="bg-background">
          <body
            className={cn(
              "min-h-screen font-sans antialiased",
              fontSans.variable,
            )}
          >
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="relative flex min-h-screen flex-col">
                <div className="flex-1">
                  {props.children}
                  {props.modal}
                </div>
                <SiteFooter />
              </div>
              <TailwindIndicator />
            </ThemeProvider>
            <Analytics />
            <Toaster />
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
