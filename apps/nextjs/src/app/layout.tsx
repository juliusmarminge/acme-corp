// import "@acme/ui/dist/index.css";
import "../styles/globals.css";
import * as React from "react";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs/app-beta";
import { Analytics } from "@vercel/analytics/react";

import { cn } from "@acme/ui";
import { Icons } from "@acme/ui/icons";
import { Toaster } from "@acme/ui/toaster";

import { TailwindIndicator } from "~/components/tailwind-indicator";
import { ThemeProvider } from "~/components/theme-provider";
import { siteConfig } from "./config";

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
        <html lang="en" suppressHydrationWarning>
          <body
            className={cn(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.variable,
            )}
          >
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="relative flex min-h-screen flex-col">
                {/* <SiteHeader /> */}
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

const ThemeToggle = React.lazy(() => import("~/components/theme-toggle"));

function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <div className="flex items-center text-lg font-medium">
            <Icons.logo className="mr-2 h-6 w-5" />
            Acme Corp
          </div>
          <p className="text-center text-sm/7 text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href={siteConfig.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Julius
            </a>
            . Components by{" "}
            <a
              href="https://twitter.com/shadcn"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Shadcn
            </a>
            . The source code is available on{" "}
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <React.Suspense>
          <ThemeToggle />
        </React.Suspense>
      </div>
    </footer>
  );
}
