import Link from "next/link";
import { Balancer } from "react-wrap-balancer";

import { Button } from "@acme/ui/button";

import { api } from "~/trpc/server";
import { DashboardShell } from "../_components/dashboard-shell";
import { ProjectCard } from "./_components/project-card";

export const runtime = "edge";

export default async function Page(props: { params: { workspaceId: string } }) {
  const { projects, limitReached } =
    await api.project.listByActiveWorkspace.query();

  return (
    <DashboardShell
      title="Projects"
      description="Projects for this workspace will show up here"
      headerAction={
        limitReached ? (
          <Button className="min-w-max">Project limit reached</Button>
        ) : (
          <Button className="min-w-max" asChild>
            <Link href={`/onboarding`}>Create a new project</Link>
          </Button>
        )
      }
    >
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard
              project={project}
              workspaceId={props.params.workspaceId}
            />
          </li>
        ))}
      </ul>

      {projects.length === 0 && (
        <div className="relative">
          <ul className="grid select-none grid-cols-1 gap-4 opacity-40 md:grid-cols-3">
            <ProjectCard.Skeleton pulse={false} />
            <ProjectCard.Skeleton pulse={false} />
            <ProjectCard.Skeleton pulse={false} />
          </ul>
          <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center">
            <Balancer>
              <h2 className="text-2xl font-bold">
                This workspace has no projects yet
              </h2>
              <p className="text-lg text-muted-foreground">
                Create your first project to get started
              </p>
            </Balancer>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
