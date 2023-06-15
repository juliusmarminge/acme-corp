import { DashboardShell } from "../../_components/dashboard-shell";
import { DeleteWorkspace } from "./delete-workspace";

export default function DangerZonePage() {
  return (
    <DashboardShell title="Danger Zone" description="Do dangerous stuff here">
      <div className="space-y-6">
        <DeleteWorkspace />
      </div>
    </DashboardShell>
  );
}
