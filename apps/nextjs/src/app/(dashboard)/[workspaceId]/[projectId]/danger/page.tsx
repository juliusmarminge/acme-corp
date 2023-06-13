import { auth } from "@clerk/nextjs";

import { Button } from "@acme/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";

import { DeleteProject } from "./delete-project";

export default function DangerZonePage(props: {
  params: { workspaceId: string; projectId: string };
}) {
  return (
    <div>
      <h1 className="text-xl font-semibold leading-none tracking-tight">
        Danger Zone
      </h1>
      <h2 className="text-base text-muted-foreground">
        Do dangerous things here
      </h2>

      <div className="h-4" />
      <div className="space-y-6">
        <TransferProjectToOrganization />
        <TransferProjectToPersonal />
        <DeleteProject projectId={props.params.projectId} />
      </div>
    </div>
  );
}

function TransferProjectToOrganization() {
  const title = "Transfer to Organization";
  const description = "Transfer this project to an organization";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="flex items-center">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">{title}</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button variant="destructive">
                {`Yes, transfer this project`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

function TransferProjectToPersonal() {
  const title = "Transfer to Personal workspace";
  const description = "Transfer this project to your personal workspace";

  const { orgId } = auth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="flex items-center">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild disabled={!orgId}>
            <Button variant="destructive">{title}</Button>
          </DialogTrigger>
          {!orgId && (
            <span className="mr-auto px-2 text-sm text-muted-foreground">
              This project is already in your personal workspace
            </span>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button variant="destructive">
                {`Yes, transfer this project`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
