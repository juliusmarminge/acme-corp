import { authRouter } from "./router/auth";
import { organizationsRouter } from "./router/organizations";
import { projectRouter } from "./router/project";
import { stripeRouter } from "./router/stripe";
import { createTRPCRouter } from "./trpc";

// Deployed to /trpc/edge/**
export const edgeRouter = createTRPCRouter({
  project: projectRouter,
  auth: authRouter,
  stripe: stripeRouter,
  organization: organizationsRouter,
});
