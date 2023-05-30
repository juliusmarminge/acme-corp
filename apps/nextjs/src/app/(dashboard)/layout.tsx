import Link from "next/link";

import { Icons } from "@acme/ui/icons";

import { SiteFooter } from "~/components/footer";
import { UserNav } from "~/components/user-nav";
import { Search } from "./_components/search";
import { WorkspaceSwitcher } from "./_components/workspace-switcher";

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden rounded-[0.5rem] bg-background">
      <nav className="border-b">
        <div className="flex h-16 items-center px-4 md:px-8">
          <Link href="/">
            <Icons.logo />
          </Link>
          <span className="mx-2 text-lg font-bold text-muted-foreground">
            /
          </span>
          <WorkspaceSwitcher />
          {/* <MainNav className="mx-6" /> */}
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            {/* @ts-expect-error - ... */}
            <UserNav />
          </div>
        </div>
      </nav>
      <main className="min-h-[calc(100vh-14rem)] flex-1 space-y-4 p-8 pt-6">
        {props.children}
      </main>
      <SiteFooter />
    </div>
  );
}
