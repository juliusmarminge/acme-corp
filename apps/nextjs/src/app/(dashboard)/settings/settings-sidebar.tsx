"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";

import { cn } from "@acme/ui";
import { Icons } from "@acme/ui/icons";

const items = [
  {
    title: "Account",
    href: "/settings/account",
    icon: "user",
  },
  {
    title: "Billing",
    href: "/settings/billing",
    icon: "billing",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "post",
  },
] as const;

export function SettingsSidebar() {
  const path = usePathname();
  const { organization } = useOrganization();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.href && (
            <Link
              key={index}
              href={"disabled" in item ? "/settings/account" : item.href}
              aria-disabled={"disabled" in item}
            >
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent",
                  "disabled" in item && "cursor-not-allowed opacity-80",
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}

      {organization && (
        <Link href={`/settings/organizations/${organization.slug}`}>
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              path.startsWith("/settings/organizations")
                ? "bg-accent"
                : "transparent",
            )}
          >
            <Icons.organization className="mr-2 h-4 w-4" />
            <span>Organization</span>
          </span>
        </Link>
      )}
    </nav>
  );
}
