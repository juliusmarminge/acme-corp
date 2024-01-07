import { auth } from "@clerk/nextjs";

import { Onboarding } from "./multi-step-form";

export const runtime = "edge";

export default function OnboardingPage() {
  const { orgId, userId } = auth();

  return (
    <>
      <Onboarding workspaceId={orgId ?? userId!} />

      <div className="absolute inset-0 top-12 -z-10 bg-cover bg-center" />
    </>
  );
}
