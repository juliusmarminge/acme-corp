import { NextResponse, type NextRequest } from "next/server";
import { getAuth, withClerkMiddleware } from "@clerk/nextjs/server";

export default withClerkMiddleware((req: NextRequest) => {
  const { userId } = getAuth(req);
  if (userId) {
    const url = new URL("/dashboard", req.url);
    NextResponse.redirect(url);
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
