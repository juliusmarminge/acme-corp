import { DashboardShell } from "../../../_components/dashboard-shell";

export default function Loading() {
  return (
    <DashboardShell
      title="Overview"
      description="Get an overview of how the project is going"
      breadcrumb
    >
      <div className="h-[600px] animate-pulse rounded-lg bg-muted"></div>
    </DashboardShell>
  );
}
