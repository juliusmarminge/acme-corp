import { NextResponse, type NextRequest } from "next/server";
import { getAuth, withClerkMiddleware } from "@clerk/nextjs/server";

const publicPaths = ["/", "/signin*", "/sso-callback*"] as const;

const isPublic = (path: string) => {
  return publicPaths.find((x) =>
    path.match(new RegExp(`^${x}$`.replace("*$", "($|/)"))),
  );
};

export default withClerkMiddleware((req: NextRequest) => {
  const { userId } = getAuth(req);

  // Redirect to home page if user is already signed in
  if (userId && req.nextUrl.pathname === "/signin") {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  // Allow public paths
  if (isPublic(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Redirect to sign in page if user is not signed in for non-public paths
  if (!userId) {
    const signInUrl = new URL("/signin", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)"],
};
