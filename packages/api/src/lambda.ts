import { ingestionRouter } from "./router/ingestion";
import { stripeRouter } from "./router/stripe";
import { createTRPCRouter } from "./trpc";

// Deployed to /trpc/lambda/**
export const lambdaRouter = createTRPCRouter({
  stripe: stripeRouter,
  ingestion: ingestionRouter,
});

export { stripe } from "./router/stripe/shared";
