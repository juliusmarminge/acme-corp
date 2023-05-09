import * as React from "react";
import { type Route } from "next";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: (props) => (
      <h1 className="font-cal mt-10 scroll-m-20 text-4xl" {...props} />
    ),
    h2: (props) => (
      <h2
        className="font-cal mt-10 scroll-m-20 border-b pb-2 text-3xl first:mt-0"
        {...props}
      />
    ),
    h3: (props) => (
      <h3 className="font-cal mt-8 scroll-m-20 text-2xl" {...props} />
    ),
    h4: (props) => (
      <h4 className="font-cal -mb-4 mt-6 scroll-m-20 text-2xl" {...props} />
    ),
    p: (props) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
    ),
    a: ({ children, href }) => {
      const isExternal = href?.startsWith("http");
      const Component = isExternal ? "a" : Link;
      return (
        <Component
          href={href as Route}
          className="underline decoration-primary decoration-2 underline-offset-4"
        >
          {children}
        </Component>
      );
    },
    ul: (props) => <ul className="mt-4 list-disc pl-8" {...props} />,
    code: (props) => (
      <code
        className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-muted-foreground"
        {...props}
      />
    ),
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    img: (props) => <img {...props} className="rounded-lg" />,

    // Pass through all other components.
    ...components,
  };
}
