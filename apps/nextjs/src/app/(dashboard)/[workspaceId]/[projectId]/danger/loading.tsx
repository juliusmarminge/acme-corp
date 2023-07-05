import { Button } from "@acme/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";

import { DashboardShell } from "~/app/(dashboard)/_components/dashboard-shell";

export default function Loading() {
  return (
    <DashboardShell
      title="Danger Zone"
      description="Do dangerous stuff here"
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Transfer to Organization</CardTitle>
          <CardDescription className="flex items-center">
            Transfer this project to an organization
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Button variant="destructive" disabled>
            Transfer to Organization
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transfer to Personal</CardTitle>
          <CardDescription className="flex items-center">
            Transfer this project to your personal workspace
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Button variant="destructive" disabled>
            Transfer to Personal
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete project</CardTitle>
          <CardDescription className="flex items-center">
            This will delete the project and all of its data.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Button variant="destructive" disabled>
            Delete project
          </Button>
        </CardFooter>
      </Card>
    </DashboardShell>
  );
}
