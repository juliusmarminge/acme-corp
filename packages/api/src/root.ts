import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { stripeRouter } from "./router/stripe";
import { createTRPCRouter, mergeRouters } from "./trpc";

// Deployed to /trpc/edge/**
export const edgeRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
});

// Deployed to /trpc/lambda/**
export const lambdaRouter = createTRPCRouter({
  stripe: stripeRouter,
});

// Used to provide a good DX with a single client
// Then, a custom link is used to generate the correct URL for the request
export const appRouter = mergeRouters(edgeRouter, lambdaRouter);
export type AppRouter = typeof appRouter;
