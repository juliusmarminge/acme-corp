import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

// Deployed to /trpc/edge/**
export const edgeRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
});
