"use client";

import { useParams, useRouter } from "next/navigation";
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
import { useToast } from "@acme/ui/use-toast";

import { api } from "~/trpc/client";

export function TransferProjectToPersonal() {
  const { projectId } = useParams();
  const { userId } = useAuth();
  const toaster = useToast();
  const router = useRouter();

  const title = "Transfer to Personal";
  const description = "Transfer this project to your personal workspace";

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
              <Button
                variant="destructive"
                onClick={async () => {
                  try {
                    if (!projectId) throw new Error("No project ID");

                    await api.project.transferToPersonal.mutate({
                      id: projectId,
                    });
                    toaster.toast({ title: "Project transferred" });
                    router.push(`/${userId}/${projectId}`);
                  } catch {
                    toaster.toast({
                      title: "Project could not be transferred",
                      variant: "destructive",
                    });
                  }
                }}
              >
                {`I'm sure. Transfer this project`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
