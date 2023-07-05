import { DashboardShell } from "~/app/(dashboard)/_components/dashboard-shell";
import { RenameProject } from "./_components/rename-project";

export default function Loading() {
  return (
    <DashboardShell
      title="Project"
      description="Manage your project"
      className="space-y-4"
    >
      <RenameProject currentName="" projectId="" />
    </DashboardShell>
  );
}
