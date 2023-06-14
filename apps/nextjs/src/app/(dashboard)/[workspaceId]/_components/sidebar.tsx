"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@acme/ui";
import * as Icons from "@acme/ui/icons";

const workspaceItems = [
  {
    title: "Projects",
    href: "/",
    icon: Icons.Post,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: Icons.Billing,
  },
  {
    title: "Danger Zone",
    href: "/danger",
    icon: Icons.Warning,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Icons.Settings,
  },
] as const;

const projectItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Icons.Dashboard,
  },
  {
    title: "API Keys",
    href: "/api-keys",
    icon: Icons.Key,
  },
  {
    title: "Danger Zone",
    href: "/danger",
    icon: Icons.Warning,
  },
] as const;

export function SidebarNav() {
  const params = useParams();
  const path = usePathname();

  // remove the workspaceId and projectId from the path when comparing active links in sidebar
  const pathname =
    path
      .replace(`/${params.workspaceId}`, "")
      .replace(`/${params.projectId}`, "") || "/";

  const items = params.projectId ? projectItems : workspaceItems;
  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = item.icon;

        let fullPath = `/${params.workspaceId}`;
        if (params.projectId) {
          fullPath += `/${params.projectId}`;
        }
        fullPath += item.href;

        return (
          item.href && (
            <Link
              key={index}
              href={fullPath}
              aria-disabled={"disabled" in item}
            >
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent" : "transparent",
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
    </nav>
  );
}
