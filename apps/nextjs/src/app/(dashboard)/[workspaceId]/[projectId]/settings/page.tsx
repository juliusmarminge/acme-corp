import { DashboardShell } from "~/app/(dashboard)/_components/dashboard-shell";
import { api } from "~/trpc/server";
import { RenameProject } from "./_components/rename-project";

export default async function ProjectSettingsPage(props: {
  params: { workspaceId: string; projectId: string };
}) {
  const { projectId } = props.params;
  const project = await api.project.byId.query({ id: projectId });

  return (
    <DashboardShell
      title="Project"
      description="Manage your project"
      className="space-y-4"
    >
      <RenameProject currentName={project.name} projectId={projectId} />
    </DashboardShell>
  );
}
