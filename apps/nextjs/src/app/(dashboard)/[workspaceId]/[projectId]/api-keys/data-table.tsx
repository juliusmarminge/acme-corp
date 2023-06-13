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
import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import * as Icons from "@acme/ui/icons";
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
  columnHelper.accessor("key", {
    // TODO: Show/Hide + Copy
    cell: function Key(t) {
      const [show, setShow] = useState(false);
      const [copied, setCopied] = useState(false);

      const key = t.getValue();
      const displayText = show ? key : "sk_live_****************";
      return (
        <div className="flex items-center justify-between">
          <span className="font-mono">{displayText}</span>
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
      const value = t.getValue();
      if (value === null) {
        return "Never expires";
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
                  await api.project.deleteApiKey.mutate({ id: apiKey.id });
                  router.refresh();
                  toaster.toast({ title: "API Key deleted" });
                } catch {
                  toaster.toast({
                    title: "Failed to delete API Key",
                    variant: "destructive",
                  });
                }
              }}
              className="text-destructive"
            >
              Delete Key
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={async () => {
                try {
                  await api.project.rollApiKey.mutate({ id: apiKey.id });
                  router.refresh();
                  toaster.toast({ title: "API Key deleted" });
                } catch {
                  toaster.toast({
                    title: "Failed to delete API Key",
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
  const table = useReactTable({
    data: props.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="group"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
