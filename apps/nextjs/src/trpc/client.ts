import { loggerLink } from "@trpc/client";
import {
  experimental_createActionHook,
  experimental_createTRPCNextAppDirClient,
  experimental_serverActionLink,
} from "@trpc/next/app-dir/client";
import superjson from "superjson";

import type { AppRouter } from "@acme/api";

import { endingLink } from "./shared";

export const api = experimental_createTRPCNextAppDirClient<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        endingLink(),
      ],
    };
  },
});

export { type RouterInputs, type RouterOutputs } from "@acme/api";

export const useAction = experimental_createActionHook({
  links: [experimental_serverActionLink()],
  transformer: superjson,
});
