"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";

import { CreateApiKeyForm } from "../../_components/create-api-key-form";

export function NewApiKeyDialog(props: { projectId: string }) {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = React.useState(false);

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
        <CreateApiKeyForm
          projectId={props.projectId}
          onSuccess={() => {
            setDialogOpen(false);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
