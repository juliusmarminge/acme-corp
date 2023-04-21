"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs/app-beta/client";
import type { HandleOAuthCallbackParams } from "@clerk/types";

import { Icons } from "@acme/ui/icons";

export const runtime = "edge";

export default function SSOCallback(props: {
  searchParams: HandleOAuthCallbackParams;
}) {
  console.log("SSO Callback", props);
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {
    void handleRedirectCallback(props.searchParams);
  }, [props, handleRedirectCallback]);

  return (
    <div className="flex items-center justify-center">
      <Icons.spinner className="mr-2 h-16 w-16 animate-spin" />
    </div>
  );
}
