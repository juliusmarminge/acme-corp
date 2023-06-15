"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, ChevronsUpDown, LayoutGrid } from "lucide-react";

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
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";

import { getRandomPatternStyle } from "~/lib/generate-pattern";

export function ProjectSwitcher(props: {
  projectsPromise: Promise<RouterOutputs["project"]["listByActiveWorkspace"]>;
}) {
  const router = useRouter();

  const { projects } = React.use(props.projectsPromise);

  const [switcherOpen, setSwitcherOpen] = React.useState(false);

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

      <Popover open={switcherOpen} onOpenChange={setSwitcherOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            role="combobox"
            aria-expanded={switcherOpen}
            aria-label="Select a project"
            className="relative w-52 justify-between"
          >
            <div
              style={getRandomPatternStyle(projectId)}
              className="absolute inset-1 opacity-25"
            />
            <span className="z-10 font-semibold">{activeProject?.name}</span>
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
                  className="text-sm font-semibold"
                >
                  <div
                    style={getRandomPatternStyle(project.id)}
                    className="absolute inset-1 opacity-25"
                  />
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
                <CommandItem
                  onSelect={() => {
                    router.push(`/${workspaceId}`);
                    setSwitcherOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <LayoutGrid className="mr-2 h-5 w-5" />
                  Browse projects
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
