import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/signin(.*)",
    "/sso-callback(.*)",
    "/terms(.*)",
    "/privacy(.*)",
    "/api(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
