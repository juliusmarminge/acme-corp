import { loggerLink } from "@trpc/client";
import { experimental_createTRPCNextAppDirClient } from "@trpc/next/app-dir/client";

import type { AppRouter } from "@acme/api";

import { endingLink, transformer } from "./shared";

export const api = experimental_createTRPCNextAppDirClient<AppRouter>({
  config() {
    return {
      transformer,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        endingLink({
          headers: {
            "x-trpc-source": "client",
          },
        }),
      ],
    };
  },
});

// export const useAction = experimental_createActionHook({
//   transformer,
//   links: [experimental_serverActionLink()],
// });

export { type RouterInputs, type RouterOutputs } from "@acme/api";
