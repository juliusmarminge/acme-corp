"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";

import { Button } from "@acme/ui/button";

import { api } from "~/trpc/client";

export function SubscribeNow(props: { planId: string }) {
  const router = useRouter();
  const session = useSession();

  return (
    <Button
      onClick={async () => {
        if (!session.isSignedIn) router.push("/signin");

        const billingPortal = await api.stripe.createSession.mutate({
          planId: props.planId,
        });
        if (billingPortal.success) window.location.href = billingPortal.url;
      }}
    >
      Subscribe now
    </Button>
  );
}
