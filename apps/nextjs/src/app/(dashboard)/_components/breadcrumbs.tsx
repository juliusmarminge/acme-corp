"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@acme/ui";

const items = {
  overview: "Overview",
  analytics: "Analytics",
  reports: "Reports",
  notifications: "Notifications",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const [_, workspaceId, projectId, ...rest] = pathname.split("/");
  const baseUrl = `/${workspaceId}/${projectId}`;
  const restAsString = rest.join("/");

  return (
    <div className="mb-4 inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
      {Object.entries(items).map(([key, value]) => {
        const isActive =
          key === restAsString || (key !== "" && restAsString.startsWith(key));
        return (
          <Link
            key={key}
            href={`${baseUrl}/${key}`}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive && "bg-background text-foreground shadow-sm",
            )}
          >
            {value}
          </Link>
        );
      })}
    </div>
  );
}
