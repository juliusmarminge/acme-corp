"use server";

import { headers } from "next/headers";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { experimental_createTRPCNextAppDirServer } from "@trpc/next/app-dir/server";
import superjson from "superjson";

import { type AppRouter } from "@acme/api";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  const vc = process.env.VERCEL_URL;
  if (vc) return `https://${vc}`;
  return `http://localhost:3000`;
};

export const api = experimental_createTRPCNextAppDirServer<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers: () => {
            return Object.fromEntries(headers().entries());
          },
        }),
      ],
    };
  },
});

export { type RouterInputs, type RouterOutputs } from "@acme/api";
