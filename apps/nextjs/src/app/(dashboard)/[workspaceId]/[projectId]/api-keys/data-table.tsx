"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format, formatRelative } from "date-fns";
import { Eye, EyeOff } from "lucide-react";

import type { RouterOutputs } from "@acme/api";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Checkbox } from "@acme/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import * as Icons from "@acme/ui/icons";
import { Label } from "@acme/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";
import { useToast } from "@acme/ui/use-toast";

import { api } from "~/trpc/client";

export type ApiKeyColumn = RouterOutputs["project"]["listApiKeys"][number];

const columnHelper = createColumnHelper<ApiKeyColumn>();

const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        disabled={
          table.getRowModel().rows.length === 0 ||
          table
            .getRowModel()
            .rows.every((row) => row.original.revokedAt !== null)
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={row.original.revokedAt !== null}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select"
      />
    ),
  }),
  columnHelper.accessor("key", {
    cell: function Key(t) {
      const [show, setShow] = useState(false);
      const [copied, setCopied] = useState(false);

      const key = t.getValue();

      const displayText = show ? key : "sk_live_****************";
      return (
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "font-mono",
              t.row.original.revokedAt !== null && "line-through",
            )}
          >
            {displayText}
          </span>
          <div className="invisible flex items-center gap-2 group-hover:visible">
            <Button
              variant="ghost"
              className="h-4 w-4 p-0 opacity-50"
              disabled={show}
              onClick={() => {
                setShow(true);
                setTimeout(() => {
                  setShow(false);
                }, 1500);
              }}
            >
              <span className="sr-only">Toggle key visibility</span>
              {show ? <EyeOff /> : <Eye />}
            </Button>
            <Button
              variant="ghost"
              className="h-4 w-4 p-0 opacity-50"
              onClick={async () => {
                setCopied(true);
                await Promise.all([
                  navigator.clipboard.writeText(key),
                  new Promise((resolve) => setTimeout(resolve, 1500)),
                ]);
                setCopied(false);
              }}
            >
              <span className="sr-only">Copy key</span>
              {copied ? <Icons.CopyDone /> : <Icons.Copy />}
            </Button>
          </div>
        </div>
      );
    },
    header: "Key",
  }),
  columnHelper.accessor("createdAt", {
    cell: (t) => format(t.getValue(), "yyyy-MM-dd"),
    header: "Created At",
  }),
  columnHelper.accessor("expiresAt", {
    cell: (t) => {
      if (t.row.original.revokedAt !== null) {
        return (
          <div className="flex flex-col text-destructive">
            <span>Revoked</span>
            <span>{format(t.row.original.revokedAt, "yyyy-MM-dd")}</span>
          </div>
        );
      }

      const value = t.getValue();
      if (value === null) {
        return "Never expires";
      }

      if (value < new Date()) {
        return (
          <div className="flex flex-col text-destructive">
            <span>Expired</span>
            <span>{format(value, "yyyy-MM-dd")}</span>
          </div>
        );
      }
      return format(value, "yyyy-MM-dd");
    },
    header: "Expires At",
  }),
  columnHelper.accessor("lastUsed", {
    cell: (t) => {
      const value = t.getValue();
      if (value === null) {
        return "Never used";
      }
      return formatRelative(value, new Date());
    },
    header: "Last Used At",
  }),
  columnHelper.display({
    id: "actions",
    header: function ActionsHeader(t) {
      const router = useRouter();
      const toaster = useToast();

      const { rows } = t.table.getSelectedRowModel();
      const ids = rows.map((row) => row.original.id);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={ids.length < 1}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Icons.Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={async () => {
                try {
                  const res = await api.project.revokeApiKeys.mutate({ ids });
                  router.refresh();
                  toaster.toast({
                    title: `Revoked ${res.numRevoked} API keys`,
                  });
                  t.table.toggleAllRowsSelected(false);
                } catch {
                  toaster.toast({
                    title: "Failed to revoke API Keys",
                    variant: "destructive",
                  });
                }
              }}
              className="text-destructive"
            >
              Revoke {ids.length} API key{ids.length > 1 ? "s" : ""}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: function Actions(t) {
      const apiKey = t.row.original;
      const router = useRouter();
      const toaster = useToast();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Icons.Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={async () => {
                try {
                  await api.project.revokeApiKeys.mutate({ ids: [apiKey.id] });
                  t.row.toggleSelected(false);
                  router.refresh();
                  toaster.toast({ title: "API Key revoked" });
                } catch {
                  toaster.toast({
                    title: "Failed to revoke API Key",
                    variant: "destructive",
                  });
                }
              }}
              className="text-destructive"
            >
              Revoke Key
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={async () => {
                try {
                  await api.project.rollApiKey.mutate({ id: apiKey.id });
                  router.refresh();
                  toaster.toast({ title: "API Key rolled" });
                } catch {
                  toaster.toast({
                    title: "Failed to roll API Key",
                    variant: "destructive",
                  });
                }
              }}
              className="text-destructive"
            >
              Roll Key
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

export function DataTable(props: { data: ApiKeyColumn[] }) {
  const [rowSelection, setRowSelection] = useState({});
  const [showRevoked, setShowRevoked] = useState(true);

  const table = useReactTable({
    data: props.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: (row) => {
      return row.original.revokedAt === null;
    },
    state: {
      rowSelection,
    },
  });

  const filteredRows = showRevoked
    ? table.getRowModel().rows
    : table
        .getRowModel()
        ?.rows.filter((row) => row.original.revokedAt === null);

  return (
    <div>
      <div className="flex items-center gap-2 py-2">
        <Label>Show revoked</Label>
        <Checkbox
          checked={showRevoked}
          onCheckedChange={(c) => setShowRevoked(!!c)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {filteredRows.length ? (
              filteredRows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  disabled={(() => {
                    if (row.original.revokedAt !== null) {
                      return true;
                    }
                    if (row.original.expiresAt !== null) {
                      return row.original.expiresAt < new Date();
                    }
                    return false;
                  })()}
                  className={cn("group")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
