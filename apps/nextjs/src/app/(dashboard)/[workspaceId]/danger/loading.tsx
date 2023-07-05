import { Button } from "@acme/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";

import { DashboardShell } from "../../_components/dashboard-shell";

export default function Loading() {
  return (
    <DashboardShell
      title="Danger Zone"
      description="Do dangerous stuff here"
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Delete workspace</CardTitle>
          <CardDescription className="flex items-center">
            This will delete the workspace and all of its data.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Button variant="destructive" disabled>
            Delete workspace
          </Button>
        </CardFooter>
      </Card>
    </DashboardShell>
  );
}
