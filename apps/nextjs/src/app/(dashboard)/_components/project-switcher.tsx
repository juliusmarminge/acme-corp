"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import type { RouterOutputs } from "@acme/api";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@acme/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@acme/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";

import { CreateProjectForm } from "../[workspaceId]/_components/create-project-form";

export function ProjectSwitcher(props: {
  projectsPromise: Promise<RouterOutputs["project"]["listByActiveWorkspace"]>;
}) {
  const router = useRouter();

  const { projects, limitReached } = React.use(props.projectsPromise);

  const [switcherOpen, setSwitcherOpen] = React.useState(false);
  const [newOrgDialogOpen, setNewOrgDialogOpen] = React.useState(false);

  const { workspaceId, projectId } = useParams();
  const activeProject = projects.find((p) => p.id === projectId);

  if (!projectId) return null;
  if (!activeProject) {
    return (
      <Button
        variant="ghost"
        size="sm"
        role="combobox"
        aria-expanded={switcherOpen}
        aria-label="Select a workspace"
        className="w-52 justify-between opacity-50"
      >
        Select a project
        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0" />
      </Button>
    );
  }

  return (
    <>
      <span className="mx-2 text-lg font-bold text-muted-foreground">/</span>

      <Dialog open={newOrgDialogOpen} onOpenChange={setNewOrgDialogOpen}>
        <Popover open={switcherOpen} onOpenChange={setSwitcherOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              role="combobox"
              aria-expanded={switcherOpen}
              aria-label="Select a workspace"
              className="w-52 justify-between"
            >
              {activeProject?.name}
              <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-0">
            <Command>
              <CommandList>
                <CommandInput placeholder="Search project..." />

                {projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    onSelect={() => {
                      setSwitcherOpen(false);
                      router.push(`/${workspaceId}/${project.id}`);
                    }}
                    className="text-sm"
                  >
                    {project.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        project.id === activeProject?.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandList>
              <CommandSeparator />
              <CommandList>
                <CommandGroup>
                  <DialogTrigger asChild>
                    <CommandItem
                      onSelect={() => {
                        setSwitcherOpen(false);
                        setNewOrgDialogOpen(true);
                      }}
                      disabled={limitReached}
                      className={cn(limitReached && "opacity-50")}
                    >
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Create Project
                    </CommandItem>
                  </DialogTrigger>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <NewProjectDialog />
      </Dialog>
    </>
  );
}

function NewProjectDialog() {
  const { workspaceId } = useParams();

  if (!workspaceId) return null;
  return (
    <DialogContent>
      <CreateProjectForm workspaceId={workspaceId} />
    </DialogContent>
  );
}
