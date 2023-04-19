"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { type HandleOAuthCallbackParams } from "@clerk/types";

/**
 * TODO: Check if this can be a server component or api route
 */
export default function SSOCallback(params: HandleOAuthCallbackParams) {
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {
    void handleRedirectCallback(params);
  }, [params, handleRedirectCallback]);
  return <div>Loading....</div>;
}
