import { type NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@acme/api";

export const runtime = "edge";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc/",
    router: appRouter,
    req: req,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
