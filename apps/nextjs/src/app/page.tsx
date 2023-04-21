import { Suspense } from "react";
import Balancer from "react-wrap-balancer";

import { cn } from "@acme/ui";
import { buttonVariants } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import { Icons } from "@acme/ui/icons";

import { MobileDropdown } from "~/components/mobile-nav";
import { UserNav } from "~/components/user-nav";
import { marketingFeatures, siteConfig } from "~/app/config";
import { MainNav } from "~/app/dashboard/components/main-nav";

export const runtime = "edge";

export default function Home() {
  return (
    <>
      <nav className="fixed left-0 right-0 z-50 border-b bg-background">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4">
          <div className="mr-8 hidden items-center md:flex">
            <Icons.logo className="mr-2 h-6 w-6" />
            <span className="text-lg font-bold tracking-tight">Acme Corp</span>
          </div>
          <MobileDropdown />
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <Suspense>
              <UserNav />
            </Suspense>
          </div>
        </div>
      </nav>
      <main className="container flex min-h-screen w-full flex-col items-center justify-center pt-48">
        <div className="z-10 min-h-[50vh] w-full max-w-4xl px-5 xl:px-0">
          {/* <a
          href="https://twitter.com/steventey/status/1613928948915920896"
          target="_blank"
          rel="noreferrer"
          className="mx-auto mb-5 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-sky-100 px-7 py-2 transition-colors hover:bg-sky-200"
        >
          <Icons.twitter className="h-5 w-5 text-sky-500" />
          <p className="text-sm font-semibold text-sky-500">
            Introducing Acme Corp
          </p>
        </a> */}
          <h1
            className="font-display animate-fade-up bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-center text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-7xl/[5rem]"
            style={{ animationDelay: "0.20s", animationFillMode: "forwards" }}
          >
            <Balancer>
              Your all-in-one, enterprise ready starting point
            </Balancer>
          </h1>
          <p
            className="mt-6 animate-fade-up text-center text-muted-foreground/80 opacity-0 md:text-xl"
            style={{ animationDelay: "0.30s", animationFillMode: "forwards" }}
          >
            <Balancer>
              Acme Corp is a Next.js starter kit that includes everything you
              need to build a modern web application. Mobile application
              preconfigured, ready to go.
            </Balancer>
          </p>
          <div
            className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
            style={{ animationDelay: "0.40s", animationFillMode: "forwards" }}
          >
            <a
              className={cn(buttonVariants({ variant: "default" }))}
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.gitHub className="mr-1 h-4 w-4" />
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
        <div className="my-16 w-full max-w-screen-lg animate-fade-up gap-5 border-t p-5 xl:px-0">
          <h2 className="py-8 text-center text-3xl font-bold md:text-4xl">
            What&apos;s included?
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {marketingFeatures.map((feature) => (
              <Card key={feature.title} className={feature.extraClassNames}>
                <CardHeader>{feature.icon}</CardHeader>
                <CardContent>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {feature.body}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
