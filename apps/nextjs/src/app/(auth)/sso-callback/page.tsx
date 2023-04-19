"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { type HandleOAuthCallbackParams } from "@clerk/types";

export default function SSOCallback(params: HandleOAuthCallbackParams) {
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {
    void handleRedirectCallback(params);
  }, [params, handleRedirectCallback]);
  return <div>Loading....</div>;
}
