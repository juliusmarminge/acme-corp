import "../styles/globals.css";
import "@acme/ui/styles.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";

import { api } from "~/utils/api";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-sans: ${fontSans.style.fontFamily};
          }
        `}
      </style>
      <Head>
        <title>Acme</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
    </>
  );
}

export default api.withTRPC(MyApp);
