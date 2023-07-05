import { Button } from "@acme/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";

import { DashboardShell } from "../_components/dashboard-shell";

export default function Loading() {
  return (
    <DashboardShell
      title="Projects"
      description="Projects for this workspace will show up here"
      headerAction={<Button disabled>Create a new project</Button>}
    >
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </ul>
    </DashboardShell>
  );
}

function ProjectCardSkeleton() {
  return (
    <Card>
      <div className="h-32 animate-pulse bg-muted" />
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex-1 animate-pulse bg-muted">&nbsp;</span>
          <span className="ml-2 rounded-md bg-teal-100 px-2 py-1 text-xs no-underline group-hover:no-underline dark:bg-teal-600">
            FREE
          </span>
        </CardTitle>
        <CardDescription className="animate-pulse bg-muted">
          &nbsp;
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
