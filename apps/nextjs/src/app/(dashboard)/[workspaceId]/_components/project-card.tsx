import Link from "next/link";

import type { RouterOutputs } from "@acme/api";
import { ProjectTier } from "@acme/db";
import { cn } from "@acme/ui";
import { Card, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";

import { getRandomPatternStyle } from "~/lib/generate-pattern";

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

export function ProjectCard(props: {
  workspaceId: string;
  project: RouterOutputs["project"]["listByActiveWorkspace"]["projects"][number];
}) {
  const { project } = props;
  return (
    <Link href={`/${props.workspaceId}/${project.id}/overview`}>
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

ProjectCard.Skeleton = function ProjectCardSkeleton(props: {
  pulse?: boolean;
}) {
  const { pulse = true } = props;
  return (
    <Card>
      <div className={cn("h-32 bg-muted", pulse && "animate-pulse")} />
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className={cn("flex-1 bg-muted", pulse && "animate-pulse")}>
            &nbsp;
          </span>
          <ProjectTierIndicator tier={ProjectTier.FREE} />
        </CardTitle>
        <CardDescription className={cn("bg-muted", pulse && "animate-pulse")}>
          &nbsp;
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
