"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs/app-beta/client";
import type { HandleOAuthCallbackParams } from "@clerk/types";

export const runtime = "edge";

/**
 * TODO: Check if this can be a server component or api route
 */
export default function SSOCallback(props: HandleOAuthCallbackParams) {
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {
    void handleRedirectCallback(props);
  }, [props, handleRedirectCallback]);
  return <div>Loading....</div>;
}
