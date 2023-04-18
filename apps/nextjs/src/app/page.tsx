// import { Github, Twitter } from "@/components/shared/icons";
// import { DEPLOY_URL } from "@/lib/constants";
// import { nFormatter } from "@/lib/utils";

import { Suspense } from "react";
import { Component } from "lucide-react";
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

import { MainNav } from "./dashboard/components/main-nav";
import { UserNav } from "./dashboard/components/user-nav";

export default function Home() {
  return (
    <>
      <div className="border-b">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4">
          <div className="mr-8 flex items-center text-lg font-bold tracking-tight">
            <Icons.logo className="mr-2 h-6 w-6" /> Acme Corp
          </div>
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <Suspense>
              {/* @ts-expect-error - Async Server Component */}
              <UserNav />
            </Suspense>
          </div>
        </div>
      </div>
      <main className="flex min-h-screen w-full flex-col items-center justify-center pt-48">
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
              className={cn(buttonVariants({ variant: "ghost" }))}
              // className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
              href={"https://vercel.com"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="mr-1 h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4L20 20H4L12 4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Deploy to Vercel</span>
            </a>
            <a
              className={cn(buttonVariants({ variant: "default" }))}
              // className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800"
              href="https://github.com/juliusmarminge/acme-corp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.gitHub className=" mr-1 h-4 w-4" />
              <span>Star on GitHub</span>
              {/* <span className="font-semibold">{nFormatter(stars)}</span> */}
            </a>
          </div>
        </div>
        <div className="my-16 w-full max-w-screen-lg animate-fade-up gap-5 border-t p-5 xl:px-0">
          <h2 className="py-8 text-center text-3xl font-bold md:text-4xl">
            What&apos;s included?
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
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

const features = [
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
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="24"
        viewBox="0 0 20 24"
        fill="none"
      >
        <path
          d="M19.116 3.1608L16.2354 6.04135C16.1449 6.13177 16.0266 6.18918 15.8996 6.20437C15.7725 6.21956 15.6441 6.19165 15.5348 6.12513C14.4017 5.44155 13.0949 5.10063 11.7722 5.14354C10.4495 5.18645 9.16759 5.61134 8.08114 6.36692C7.41295 6.83202 6.83276 7.41221 6.36765 8.0804C5.61297 9.16751 5.18848 10.4495 5.14524 11.7722C5.10201 13.0949 5.44187 14.4019 6.12395 15.536C6.19 15.6451 6.21764 15.7731 6.20246 15.8998C6.18728 16.0264 6.13015 16.1443 6.04018 16.2347L3.15962 19.1152C3.10162 19.1736 3.03168 19.2188 2.95459 19.2476C2.87751 19.2765 2.79511 19.2883 2.71302 19.2824C2.63093 19.2764 2.5511 19.2528 2.479 19.2131C2.40689 19.1734 2.34422 19.1186 2.29527 19.0524C0.736704 16.9101 -0.0687588 14.3121 0.0046021 11.6639C0.077963 9.01568 1.02602 6.46625 2.70079 4.41354C3.21208 3.78549 3.78622 3.21134 4.41428 2.70006C6.46683 1.02574 9.01589 0.0779624 11.6637 0.00460332C14.3115 -0.0687557 16.9091 0.736432 19.0512 2.29453C19.1179 2.34332 19.1731 2.40598 19.2131 2.47818C19.2532 2.55038 19.2771 2.6304 19.2833 2.71274C19.2895 2.79508 19.2777 2.87778 19.2488 2.95513C19.2199 3.03248 19.1746 3.10265 19.116 3.1608Z"
          fill="currentColor"
        />
        <path
          d="M19.1135 20.8289L16.2329 17.9483C16.1424 17.8579 16.0241 17.8005 15.8971 17.7853C15.7701 17.7701 15.6416 17.798 15.5323 17.8645C14.4639 18.509 13.2398 18.8497 11.9921 18.8497C10.7443 18.8497 9.52022 18.509 8.45181 17.8645C8.34252 17.798 8.21406 17.7701 8.08701 17.7853C7.95997 17.8005 7.84171 17.8579 7.75119 17.9483L4.87063 20.8289C4.81022 20.8869 4.76333 20.9576 4.73329 21.0358C4.70324 21.114 4.69078 21.1979 4.69678 21.2815C4.70277 21.3651 4.72708 21.4463 4.76799 21.5194C4.80889 21.5926 4.86538 21.6558 4.93346 21.7046C6.98391 23.1965 9.45442 24.0001 11.9902 24.0001C14.5259 24.0001 16.9964 23.1965 19.0469 21.7046C19.1152 21.6561 19.172 21.5931 19.2133 21.5201C19.2545 21.4471 19.2792 21.366 19.2856 21.2824C19.2919 21.1988 19.2798 21.1148 19.2501 21.0365C19.2203 20.9581 19.1737 20.8872 19.1135 20.8289V20.8289Z"
          fill="currentColor"
        />
        <path
          d="M11.9973 15.4223C13.8899 15.4223 15.4243 13.888 15.4243 11.9953C15.4243 10.1027 13.8899 8.56836 11.9973 8.56836C10.1046 8.56836 8.57031 10.1027 8.57031 11.9953C8.57031 13.888 10.1046 15.4223 11.9973 15.4223Z"
          fill="currentColor"
        />
      </svg>
    ),
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
];
