import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { projectRouter } from "./router/project";
import { createTRPCRouter } from "./trpc";

// Deployed to /trpc/edge/**
export const edgeRouter = createTRPCRouter({
  post: postRouter,
  project: projectRouter,
  auth: authRouter,
});
