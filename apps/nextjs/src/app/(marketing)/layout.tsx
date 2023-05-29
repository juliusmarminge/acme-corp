import { Suspense } from "react";
import type { ReactNode } from "react";

import { Icons } from "@acme/ui/icons";

import { SiteFooter } from "~/components/footer";
import { MobileDropdown } from "~/components/mobile-nav";
import { UserNav } from "~/components/user-nav";
import { MainNav } from "../dashboard/components/main-nav";

export default function MarketingLayout(props: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="container z-50 flex h-16 border-b bg-background">
        <div className="mr-8 hidden items-center md:flex">
          <Icons.logo className="mr-2 h-6 w-6" />
          <span className="text-lg font-bold tracking-tight">Acme Corp</span>
        </div>
        <MobileDropdown />
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <Suspense>
            {/* @ts-expect-error - Async Server Component */}
            <UserNav />
          </Suspense>
        </div>
      </nav>

      <main className="flex-1">{props.children}</main>
      <SiteFooter />
    </div>
  );
}
