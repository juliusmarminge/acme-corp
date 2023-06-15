import { authRouter } from "./router/auth";
import { organizationsRouter } from "./router/organizations";
import { projectRouter } from "./router/project";
import { createTRPCRouter } from "./trpc";

// Deployed to /trpc/edge/**
export const edgeRouter = createTRPCRouter({
  project: projectRouter,
  auth: authRouter,
  organization: organizationsRouter,
});
