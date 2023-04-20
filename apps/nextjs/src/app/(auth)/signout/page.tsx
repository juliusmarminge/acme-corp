"use client";

import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

import { Button } from "@acme/ui/button";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function AuthenticationPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign Out</h1>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to sign out?
        </p>
        <Button
          onClick={async () => {
            await signOut();
            router.push("/?redirect=false");
          }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
