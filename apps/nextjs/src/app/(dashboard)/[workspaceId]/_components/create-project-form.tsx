"use client";

import { useRouter } from "next/navigation";

import type { CreateProject } from "@acme/api/validators";
import { createProjectSchema } from "@acme/api/validators";
import { Button } from "@acme/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { useToast } from "@acme/ui/use-toast";

import { useZodForm } from "~/lib/zod-form";
import { api } from "~/trpc/client";

export const CreateProjectForm = (props: { workspaceId: string }) => {
  const router = useRouter();
  const toaster = useToast();

  const form = useZodForm({ schema: createProjectSchema });

  async function onSubmit(data: CreateProject) {
    try {
      const projectId = await api.project.create.mutate(data);
      router.push(`/${props.workspaceId}/${projectId}`);
      toaster.toast({
        title: "Project created",
        description: `Project ${data.name} created successfully.`,
      });
    } catch (error) {
      toaster.toast({
        title: "Error creating project",
        variant: "destructive",
        description:
          "An issue occurred while creating your project. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Acme Corp" />
              </FormControl>
              <FormDescription>
                A name to identify your app in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://acme-corp.com" />
              </FormControl>
              <FormDescription>
                The URL where your tRPC router is deployed
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Project</Button>
      </form>
    </Form>
  );
};
