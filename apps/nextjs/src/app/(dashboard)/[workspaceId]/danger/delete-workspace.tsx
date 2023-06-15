"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

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
import * as Icons from "@acme/ui/icons";
import { useToast } from "@acme/ui/use-toast";

import { api } from "~/trpc/client";

export function DeleteWorkspace() {
  const toaster = useToast();
  const router = useRouter();
  const { orgId } = useAuth();

  const title = "Delete workspace";
  const description = "This will delete the workspace and all of its data.";

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
              You can not delete your personal workspace
            </span>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="flex items-center font-bold text-destructive">
              <Icons.Warning className="mr-2 h-6 w-6" />
              <p>This action can not be reverted</p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={async () => {
                  try {
                    await api.organization.deleteOrganization.mutate();
                    toaster.toast({ title: "Workspace deleted" });
                    router.push(`/dashboard`);
                  } catch {
                    toaster.toast({
                      title: "The workspace could not be deleted",
                      variant: "destructive",
                    });
                  }
                }}
              >
                {`I'm sure. Delete this workspace`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
