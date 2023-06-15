import { Suspense } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs";

import { buttonVariants } from "@acme/ui/button";
import * as Icons from "@acme/ui/icons";

import { SiteFooter } from "~/components/footer";
import { MobileDropdown } from "~/components/mobile-nav";
import { siteConfig } from "~/app/config";
import { MainNav } from "../(dashboard)/_components/main-nav";

export default function MarketingLayout(props: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="container z-50 flex h-16 items-center border-b bg-background">
        <div className="mr-8 hidden items-center md:flex">
          <Icons.Logo className="mr-2 h-6 w-6" />
          <span className="text-lg font-bold tracking-tight">
            {siteConfig.name}
          </span>
        </div>
        <MobileDropdown />
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <Suspense>
            <DashboardLink />
          </Suspense>
        </div>
      </nav>

      <main className="flex-1">{props.children}</main>
      <SiteFooter />
    </div>
  );
}

function DashboardLink() {
  const { userId, orgId } = auth();

  if (!userId) {
    return (
      <Link href="/signin" className={buttonVariants({ variant: "outline" })}>
        Sign In
        <Icons.ChevronRight className="ml-1 h-4 w-4" />
      </Link>
    );
  }

  return (
    <Link
      href={`/${orgId ?? userId}`}
      className={buttonVariants({ variant: "outline" })}
    >
      Dashboard
      <Icons.ChevronRight className="ml-1 h-4 w-4" />
    </Link>
  );
}
