"use client";

import { use } from "react";
import { useParams, useRouter } from "next/navigation";

import type { TransferToOrg } from "@acme/api/validators";
import { transferToOrgSchema } from "@acme/api/validators";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { useToast } from "@acme/ui/use-toast";

import { useZodForm } from "~/lib/zod-form";
import type { RouterOutputs } from "~/trpc/client";
import { api } from "~/trpc/client";

export function TransferProjectToOrganization(props: {
  orgsPromise: Promise<RouterOutputs["auth"]["listOrganizations"]>;
}) {
  const { workspaceId, projectId } = useParams();
  const orgs = use(props.orgsPromise);

  const toaster = useToast();
  const router = useRouter();

  const form = useZodForm({
    schema: transferToOrgSchema,
    defaultValues: {
      projectId,
    },
  });

  async function onSubmit(data: TransferToOrg) {
    try {
      if (!projectId) throw new Error("No project ID");

      await api.project.transferToOrganization.mutate(data);
      toaster.toast({ title: "Project transferred" });
      router.push(`/${data.orgId}/${projectId}`);
    } catch {
      toaster.toast({
        title: "Project could not be transferred",
        variant: "destructive",
      });
    }
  }

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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>{title}</DialogTitle>
                  <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <FormField
                  control={form.control}
                  name="orgId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {orgs
                            .filter((org) => org.id !== workspaceId)
                            .map((org) => (
                              <SelectItem key={org.id} value={org.id}>
                                {org.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive" type="submit">
                    {`I'm sure. Transfer this project`}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
