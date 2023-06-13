import { DashboardShell } from "~/app/(dashboard)/_components/dashboard-shell";
import { api } from "~/trpc/server";
import { DataTable } from "./data-table";
import { NewApiKeyDialog } from "./new-api-key-dialog";

export default async function ApiKeysPage(props: {
  params: { projectId: string; workspaceId: string };
}) {
  const apiKeys = await api.project.listApiKeys.query({
    projectId: props.params.projectId,
  });

  return (
    <DashboardShell
      title="API Keys"
      description="Manage your API Keys"
      headerAction={<NewApiKeyDialog projectId={props.params.projectId} />}
    >
      <DataTable data={apiKeys} />
    </DashboardShell>
  );
}
