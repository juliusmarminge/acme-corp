"use server";

import { headers } from "next/headers";
import { auth } from "@clerk/nextjs";
import { loggerLink } from "@trpc/client";
import {
  experimental_createServerActionHandler,
  experimental_createTRPCNextAppDirServer,
} from "@trpc/next/app-dir/server";
import superjson from "superjson";

import { createInnerTRPCContext } from "@acme/api";
import type { AppRouter } from "@acme/api";
import { edgeRouter } from "@acme/api/src/edge";

import { endingLink } from "./shared";

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
        endingLink({
          headers: Object.fromEntries(headers().entries()),
        }),
      ],
    };
  },
});

export { type RouterInputs, type RouterOutputs } from "@acme/api";

export const createAction = experimental_createServerActionHandler({
  router: edgeRouter,
  createContext: () => createInnerTRPCContext({ auth: auth() }),
});
