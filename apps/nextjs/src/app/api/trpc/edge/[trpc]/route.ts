import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createTRPCContext } from "@acme/api";
import { edgeRouter } from "@acme/api/edge";

// export const runtime = "edge";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc/edge",
    router: edgeRouter,
    req: req,
    createContext: () => createTRPCContext({ req }),
    onError: ({ error, path }) => {
      console.log("Error in tRPC handler (edge) on path", path);
      console.error(error);
    },
  });

export { handler as GET, handler as POST };
