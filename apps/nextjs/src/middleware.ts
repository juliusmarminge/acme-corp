import { NextResponse, type NextRequest } from "next/server";
import { getAuth, withClerkMiddleware } from "@clerk/nextjs/server";

export default withClerkMiddleware((req: NextRequest) => {
  const { userId } = getAuth(req);
  const url = new URL(req.url);
  if (userId && url.searchParams.get("redirect") !== "false") {
    NextResponse.redirect(new URL("/dashboard", url.origin));
  }

  return NextResponse.next();
});

// Stop Middleware running on static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     */
    "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
  ],
};
