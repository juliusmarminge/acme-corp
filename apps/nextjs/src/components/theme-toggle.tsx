"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { Icons } from "@acme/ui/icons";

export default function ThemeToggle(props: {
  align?: "center" | "start" | "end";
  side?: "top" | "bottom";
}) {
  const { setTheme, theme } = useTheme();

  const triggerIcon = {
    light: <Icons.sun className="h-6 w-6" />,
    dark: <Icons.moon className="h-6 w-6" />,
    system: <Icons.system className="h-6 w-6" />,
  }[theme as "light" | "dark" | "system"];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 px-2 text-lg font-semibold md:text-base"
        >
          {triggerIcon}
          <span className="capitalize">{theme}</span>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={props.align} side={props.side}>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Icons.sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Icons.moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Icons.system className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
