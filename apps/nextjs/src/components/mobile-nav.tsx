import Link from "next/link";

import { Button } from "@acme/ui/button";
import { Icons } from "@acme/ui/icons";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@acme/ui/sheet";

import { navItems } from "~/app/config";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Icons.logo className="mr-2 h-6 w-6" />
          <span className="text-lg font-bold tracking-tight">Acme Corp</span>
        </Button>
      </SheetTrigger>
      <SheetContent size="lg" position="left" className="pr-0">
        <SheetClose className="flex items-center">
          <Icons.logo className="mr-2 h-6 w-6" />
          <span className="text-lg font-bold">Acme Corp</span>
        </SheetClose>
        {navItems.map((item) => (
          <SheetClose asChild key={item.href}>
            <Link
              href={item.href}
              // className="mt-2 flex items-center text-lg font-semibold sm:text-sm"
              className="flex text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.title}
            </Link>
          </SheetClose>
        ))}
      </SheetContent>
    </Sheet>
  );
}
