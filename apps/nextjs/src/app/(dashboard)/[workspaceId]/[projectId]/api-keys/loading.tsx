import { DashboardShell } from "~/app/(dashboard)/_components/dashboard-shell";
import { DataTable } from "./data-table";
import { NewApiKeyDialog } from "./new-api-key-dialog";

export default function Loading() {
  return (
    <DashboardShell
      title="API Keys"
      description="Manage your API Keys"
      headerAction={<NewApiKeyDialog projectId="" />}
    >
      <DataTable data={[]} />
    </DashboardShell>
  );
}
