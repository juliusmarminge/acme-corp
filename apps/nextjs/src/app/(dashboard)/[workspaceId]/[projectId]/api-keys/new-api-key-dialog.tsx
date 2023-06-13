"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { add, format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import type { CreateApiKey } from "@acme/api/validators";
import { createApiKeySchema } from "@acme/api/validators";
import { Button } from "@acme/ui/button";
import { Calendar } from "@acme/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
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
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";
import { useToast } from "@acme/ui/use-toast";

import { useZodForm } from "~/lib/zod-form";
import { api } from "~/trpc/client";

export function NewApiKeyDialog(props: { projectId: string }) {
  const toaster = useToast();
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);

  const form = useZodForm({
    schema: createApiKeySchema,
    defaultValues: { projectId: props.projectId },
  });

  async function onSubmit(data: CreateApiKey) {
    try {
      await api.project.createApiKey.mutate(data);

      form.reset();
      router.refresh();
      setDialogOpen(false);
      toaster.toast({
        title: "API Key Created",
        description: `Project ${data.name} created successfully.`,
      });
    } catch (error) {
      toaster.toast({
        title: "Error creating API Key",
        variant: "destructive",
        description:
          "An issue occurred while creating your key. Please try again.",
      });
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Create API Key</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            Fill out the form to create an API key.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="New Token" />
                  </FormControl>
                  <FormDescription>
                    Enter a unique name for your token to differentiate it from
                    other tokens.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Exiration date</FormLabel>
                  <Popover
                    open={datePickerOpen}
                    onOpenChange={setDatePickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-muted-foreground">
                              Pick a date
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setDatePickerOpen(false);
                        }}
                        disabled={(date) =>
                          // future dates up to 1 year only
                          date < new Date() ||
                          date > add(new Date(), { years: 1 })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    We <b>strongly recommend</b> you setting an expiration date
                    for your API key, but you can also leave it blank to create
                    a permanent key.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create Project</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
