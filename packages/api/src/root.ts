import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { stripeRouter } from "./router/stripe";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
