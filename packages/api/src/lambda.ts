import { edgeRouter } from "./edge";
import { stripeRouter } from "./router/stripe";
import { createTRPCRouter } from "./trpc";

// Deployed to /trpc/lambda/**
export const lambdaRouter = createTRPCRouter({
  edge: edgeRouter,
  stripe: stripeRouter,
});

export { stripe } from "./router/stripe/shared";
