import { cache } from "react";
import { cookies, headers } from "next/headers";
import { auth } from "@clerk/nextjs";
import { createTRPCClient, loggerLink, TRPCClientError } from "@trpc/client";
import { callProcedure } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import type { TRPCErrorResponse } from "@trpc/server/rpc";

import { appRouter, createTRPCContext } from "@acme/api";
import type { AppRouter } from "@acme/api";

import { endingLink, transformer } from "./shared";

const createContext = cache(() => {
  return createTRPCContext({
    headers: new Headers({
      cookie: cookies().toString(),
      "x-trpc-source": "server",
    }),
    auth: auth(),
  });
});

export const api = createTRPCClient<AppRouter>({
  transformer: transformer,
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    endingLink({
      headers: () => {
        const h = new Map(headers());
        h.delete("connection");
        h.delete("transfer-encoding");
        h.set("x-trpc-source", "server");
        return Object.fromEntries(h.entries());
      },
    }),
    /**
     * Custom RSC link that lets us invoke procedures without using http requests. Since Server
     * Components always run on the server, we can just call the procedure as a function.
     */
    () =>
      ({ op }) =>
        observable((observer) => {
          createContext()
            .then((ctx) => {
              return callProcedure({
                procedures: appRouter._def.procedures,
                path: op.path,
                rawInput: op.input,
                ctx,
                type: op.type,
              });
            })
            .then((data) => {
              observer.next({ result: { data } });
              observer.complete();
            })
            .catch((cause: TRPCErrorResponse) => {
              observer.error(TRPCClientError.from(cause));
            });
        }),
  ],
});

export { type RouterInputs, type RouterOutputs } from "@acme/api";
