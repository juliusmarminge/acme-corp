import Link from "next/link";

import { ProjectTier } from "@acme/db/enums";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import * as Icons from "@acme/ui/icons";

import { getRandomPatternStyle } from "~/lib/generate-pattern";
import type { RouterOutputs } from "~/trpc/server";
import { api } from "~/trpc/server";
import { DashboardShell } from "../_components/dashboard-shell";
import { CreateProjectForm } from "./_components/create-project-form";

export const runtime = "edge";

function ProjectTierIndicator(props: { tier: ProjectTier }) {
  return (
    <span
      className={cn(
        "ml-2 rounded-md px-2 py-1 text-xs no-underline group-hover:no-underline",
        props.tier === ProjectTier.FREE && "bg-teal-100 dark:bg-teal-600",
        props.tier === ProjectTier.PRO && "bg-red-100 dark:bg-red-800",
      )}
    >
      {props.tier}
    </span>
  );
}

export default async function Page(props: { params: { workspaceId: string } }) {
  const { projects, limitReached } =
    await api.project.listByActiveWorkspace.query();

  return (
    <DashboardShell
      title="Projects"
      description="Projects for this workspace will show up here"
      headerAction={
        <Dialog>
          <DialogTrigger asChild disabled={limitReached}>
            {limitReached ? (
              <Button className="min-w-max">Project limit reached</Button>
            ) : (
              <Button className="aspect-square min-w-max p-1 md:aspect-auto md:px-4 md:py-2">
                <Icons.Add className="block h-5 w-5 md:hidden" />
                <span className="hidden md:block">Create a new project</span>
              </Button>
            )}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new project</DialogTitle>
              <DialogDescription>
                Fill out the form below to create your new project
              </DialogDescription>
            </DialogHeader>
            <CreateProjectForm workspaceId={props.params.workspaceId} />
          </DialogContent>
        </Dialog>
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
        <div>
          <h2 className="text-xl font-semibold">No projects yet</h2>
          <p className="text-muted-foreground">
            Create your first project to get started
          </p>
        </div>
      )}
    </DashboardShell>
  );
}

function ProjectCard(props: {
  workspaceId: string;
  project: RouterOutputs["project"]["listByActiveWorkspace"]["projects"][number];
}) {
  const { project } = props;
  return (
    <Link href={`/${props.workspaceId}/${project.id}`}>
      <Card className="overflow-hidden">
        <div className="h-32" style={getRandomPatternStyle(project.id)} />
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{project.name}</span>
            <ProjectTierIndicator tier={project.tier} />
          </CardTitle>
          <CardDescription>{project.url}&nbsp;</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
