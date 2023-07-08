import dynamic from "next/dynamic";
import Link from "next/link";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import * as Icons from "@acme/ui/icons";

import { siteConfig } from "~/app/config";

const ThemeToggle = dynamic(() => import("~/components/theme-toggle"), {
  ssr: false,
  loading: () => (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1 px-2 text-lg font-semibold md:text-base"
    >
      <div className="h-6 w-6 animate-pulse rounded-full bg-muted-foreground/70" />
      <span className="w-14 animate-pulse rounded bg-muted-foreground/70 capitalize">
        &nbsp;
      </span>
    </Button>
  ),
});

export function SiteFooter(props: { className?: string }) {
  return (
    <footer className={cn("container border-t", props.className)}>
      <div className="my-4 grid grid-cols-2 md:flex md:items-center">
        <Link
          href="/"
          className="col-start-1 row-start-1 flex items-center gap-2 md:mr-2"
        >
          <Icons.Logo className="h-6 w-6" />
          <p className="text-lg font-medium md:hidden">{siteConfig.name}</p>
        </Link>
        <p className="col-span-full row-start-2 text-center text-sm leading-loose text-muted-foreground md:flex-1 md:text-left">
          Built by{" "}
          <a
            href={siteConfig.twitter}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Julius
          </a>
          . Inspired by{" "}
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
        <div className="col-start-2 row-start-1 flex h-12 justify-end">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
