import { Download } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

import { CalendarDateRangePicker } from "~/app/(dashboard)/_components/date-range-picker";
import { DashboardShell } from "../../_components/dashboard-shell";

export default function Loading() {
  return (
    <DashboardShell
      title="Dashboard"
      description="Get an overview of how the project is going"
      headerAction={
        <div className="flex items-center gap-2">
          <CalendarDateRangePicker align="start" />
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      }
    >
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="h-[600px] animate-pulse rounded-lg bg-muted"></div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
