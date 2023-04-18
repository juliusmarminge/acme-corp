import "@acme/ui/styles.css";
import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs/app-beta";

import { cn } from "@acme/ui";
import { Toaster } from "@acme/ui/toaster";

import { TailwindIndicator } from "../components/tailwind-indicator";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout(props: { children: React.ReactNode }) {
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
            {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
            <div className="relative flex min-h-screen flex-col">
              {/* <SiteHeader /> */}
              <div className="flex-1">{props.children}</div>
              {/* <SiteFooter /> */}
            </div>
            <TailwindIndicator />
            {/* </ThemeProvider> */}

            <Toaster />
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
