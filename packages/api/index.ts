import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./src/root";

export { createTRPCContext, createInnerTRPCContext } from "./src/trpc";

// Export stripe router separately since it is incompatible with Edge runtimes
// and we want the rest of our endpoints to be running on the Edge => split it up
export { type AppRouter } from "./src/root";

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
