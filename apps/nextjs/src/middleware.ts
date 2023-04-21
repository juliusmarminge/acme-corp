import { NextResponse, type NextRequest } from "next/server";
import { getAuth, withClerkMiddleware } from "@clerk/nextjs/server";

const publicPaths = ["/", "/signin*", "/sso-callback*"] as const;

const isPublic = (path: string) => {
  return publicPaths.find((x) =>
    path.match(new RegExp(`^${x}$`.replace("*$", "($|/)"))),
  );
};

export default withClerkMiddleware((req: NextRequest) => {
  if (isPublic(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const { userId } = getAuth(req);
  if (!userId) {
    const signInUrl = new URL("/signin", req.url);
    // signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  console.log({ url: req.url, nextUrl: req.nextUrl });

  if (req.nextUrl.pathname === "/signin") {
    // Redirect to home page if user is already signed in
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)"],
};
