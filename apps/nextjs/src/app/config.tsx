import { Component, Globe } from "lucide-react";

import { Icons } from "@acme/ui/icons";

export const siteConfig = {
  github: "https://github.com/juliusmarminge/acme-corp",
  twitter: "https://twitter.com/jullerino",
};

export const navItems = [
  {
    href: "/dashboard",
    title: "Overview",
  },
  {
    href: "/dashboard",
    title: "Customers",
  },
  {
    href: "/dashboard",
    title: "Products",
  },
  {
    href: "/dashboard",
    title: "Settings",
  },
];

export const marketingFeatures = [
  {
    icon: <Component />,
    title: "UI Package",
    body: (
      <>
        A UI package with all the components you need for your next application.
        Built by the wonderful{" "}
        <a
          href="https://ui.shadcn.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Shadcn
        </a>
        .
      </>
    ),
  },
  {
    icon: <Icons.clerkWide />,
    title: "Authentication",
    body: (
      <>
        Protect pages and API routes throughout your entire app using{" "}
        <a
          href="https://clerk.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Clerk
        </a>
        .
      </>
    ),
  },
  {
    icon: <Icons.mdx />,
    title: "MDX",
    body: (
      <>
        Preconfigured MDX as Server Components. MDX is the best way to write
        contentful pages.
      </>
    ),
  },
  {
    icon: (
      <div className="flex gap-2 self-start">
        <Icons.trpc className="h-8 w-8" />
        <Icons.nextjs className="h-8 w-8" />
        <Icons.react className="h-8 w-8" />
        <Icons.kysely className="h-8 w-8" />
        <Icons.prisma className="h-8 w-8" />
      </div>
    ),
    extraClassNames: "md:col-span-2",
    title: "Full-stack Typesafety",
    body: (
      <>
        Full-stack Typesafety with{" "}
        <a
          href="https://trpc.io"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          tRPC
        </a>
        ,{" "}
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Next.js
        </a>
        , and{" "}
        <a
          href="https://reactjs.org"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          React
        </a>{" "}
        Server Components. Typesafe database access using{" "}
        <a
          href="https://kysely.dev"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Kysely
        </a>{" "}
        as query builder, and{" "}
        <a
          href="https://prisma.io"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Prisma
        </a>{" "}
        for schema management.
      </>
    ),
  },
  {
    icon: <Globe />,
    title: "Edge Compute",
    body: (
      <>
        Ready to deploy on Edge functions to ensure a blazingly fast application
        with optimal UX.
      </>
    ),
  },
];
