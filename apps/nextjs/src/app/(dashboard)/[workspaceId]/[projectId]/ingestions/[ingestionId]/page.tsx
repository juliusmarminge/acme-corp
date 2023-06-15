import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";

import { DashboardShell } from "~/app/(dashboard)/_components/dashboard-shell";
import { api } from "~/trpc/server";

export default async function IngestionPage(props: {
  params: { workspaceId: string; projectId: string; ingestionId: string };
}) {
  const ingestion = await api.ingestion.byId.query({
    id: props.params.ingestionId,
  });

  return (
    <DashboardShell
      title="Ingestion"
      description="Ingestion details"
      className="space-y-4"
    >
      <Table>
        <TableHeader>
          <TableRow className="pointer-events-none bg-muted">
            <TableHead>Id</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Commit</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Parent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{ingestion.id}</TableCell>
            <TableCell>
              {format(ingestion.createdAt, "yyyy-MM-dd HH:mm:ss")}
            </TableCell>
            <TableCell>{ingestion.hash}</TableCell>
            <TableCell>{ingestion.origin}</TableCell>
            <TableCell>{ingestion.parent}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <h3 className="text-lg font-medium">Schema</h3>
      <pre className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
        {JSON.stringify(ingestion.schema, null, 4)}
      </pre>
    </DashboardShell>
  );
}
