import Link from "next/link";

import { cn } from "@acme/ui";

import { navItems } from "~/app/config";

// TODO: idx not needed as key when all items have unique hrefs
// also, the active link should be filtered by href and not idx
export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn(
        "hidden items-center space-x-4 md:flex lg:space-x-6",
        className,
      )}
      {...props}
    >
      {navItems.map((item, idx) => (
        <Link
          href={item.href}
          key={`${item.href}-${idx}`}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            idx !== 0 && "text-muted-foreground",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
