import { type ReactNode } from "react";

import { Icons } from "@acme/ui/icons";

export default function AuthLayout(props: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center overflow-hidden rounded-[0.5rem] bg-background">
      <div className=" relative h-screen flex-col items-center justify-center md:grid lg:grid-cols-2">
        <div className="relative h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80)",
            }}
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Icons.logo className="mr-2 h-6 w-6" /> Acme Corp
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before. Highly recommended!&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">{props.children}</div>
      </div>
    </div>
  );
}
