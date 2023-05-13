import { Suspense } from "react";

import { Icons } from "@acme/ui/icons";

import { MobileDropdown } from "~/components/mobile-nav";
import { UserNav } from "~/components/user-nav";
import { MainNav } from "../dashboard/components/main-nav";

export default function InfoLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <nav className="fixed left-0 right-0 z-50 border-b bg-background">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4">
          <div className="mr-8 hidden items-center md:flex">
            <Icons.logo className="mr-2 h-6 w-6" />
            <span className="text-lg font-bold tracking-tight">Acme Corp</span>
          </div>
          <MobileDropdown />
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <Suspense>
              {/* @ts-expect-error - ... */}
              <UserNav />
            </Suspense>
          </div>
        </div>
      </nav>
      <main className="container max-w-4xl pt-16">{props.children}</main>
    </>
  );
}
