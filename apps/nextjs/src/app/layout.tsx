import "react-image-crop/dist/ReactCrop.css";
import "~/styles/globals.css";

import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";

import { cn } from "@acme/ui";
import { Toaster } from "@acme/ui/toaster";

import { TailwindIndicator } from "~/components/tailwind-indicator";
import { ThemeProvider } from "~/components/theme-provider";
import { siteConfig } from "./config";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const fontCal = LocalFont({
  src: "../styles/calsans.ttf",
  variable: "--font-cal",
});

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [{ url: "/opengraph-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: "https://acme-corp-lib.vercel.app/opengraph-image.png" }],
    creator: "@jullerino",
  },
  metadataBase: new URL("https://acme-corp.jumr.dev"),
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning className="bg-background">
          <body
            className={cn(
              "min-h-screen font-sans antialiased",
              fontSans.variable,
              fontCal.variable,
            )}
          >
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {props.children}
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
