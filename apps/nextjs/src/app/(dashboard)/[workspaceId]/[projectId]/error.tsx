"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { Button } from "@acme/ui/button";

import { DashboardShell } from "../../_components/dashboard-shell";

export default function Error(props: { error: Error; reset: () => void }) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(props.error);
  }, [props.error]);

  // This should prob go in some config to make sure it's synced between loading.tsx, page.tsx and error.tsx etc
  const pathname = usePathname();
  const path = pathname.split("/")[3];
  const { title, description } = (() => {
    switch (path) {
      case "ingestions":
        return {
          title: "Ingestions",
          description: "Ingestion details",
        };
      case "pulls":
        return {
          title: "Pull Request",
          description: "Browse pull requests changes",
        };
      default:
        return {
          title: "Overview",
          description: "Get an overview of how the project is going",
        };
    }
  })();

  return (
    <DashboardShell title={title} description={description} breadcrumb>
      <div className="flex h-[600px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed">
        <h2 className="text-xl font-bold">Something went wrong!</h2>
        <p className="text-base text-muted-foreground">
          {`We're sorry, something went wrong. Please try again.`}
        </p>
        <Button onClick={() => props.reset()}>Try again</Button>
      </div>
    </DashboardShell>
  );
}
