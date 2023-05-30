import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createTRPCContext, lambdaRouter } from "@acme/api";

// Stripe is incompatible with Edge runtimes due to using Node.js events
// export const runtime = "edge";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc/lambda",
    router: lambdaRouter,
    req: req,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
