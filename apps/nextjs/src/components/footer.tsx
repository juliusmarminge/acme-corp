import dynamic from "next/dynamic";
import Link from "next/link";

import { cn } from "@acme/ui";
import { Icons } from "@acme/ui/icons";

import { siteConfig } from "~/app/config";

const ThemeToggle = dynamic(() => import("~/components/theme-toggle"), {
  ssr: false,
});

export function SiteFooter(props: { className?: string }) {
  return (
    <footer className={cn("border-t", props.className)}>
      <div className="container flex flex-col items-center gap-2 py-6 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <Icons.logo className="h-6 w-6" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href={siteConfig.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Julius
            </a>
            . Inspired by
            <a
              href="https://tx.shadcn.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Taxonomy
            </a>
            . Components by{" "}
            <a
              href="https://twitter.com/shadcn"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Shadcn
            </a>
            . The source code is available on{" "}
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <ThemeToggle />
      </div>
    </footer>
  );
}
