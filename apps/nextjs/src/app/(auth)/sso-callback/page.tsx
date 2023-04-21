"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs/app-beta/client";
import type { HandleOAuthCallbackParams } from "@clerk/types";

// export const runtime = "edge";

/**
 * TODO: Check if this can be a server component or api route
 */
export default function SSOCallback(props: {
  searchParams: HandleOAuthCallbackParams;
}) {
  console.log("SSO Callback", props);
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {
    void new Promise((res) => {
      setTimeout(res, 1000);
    }).then(() => {
      void handleRedirectCallback(props.searchParams).catch((err) =>
        console.error("SSO handleRedirectCallback error", err),
      );
      console.log("Callback done");
    });
  }, [props, handleRedirectCallback]);

  return <div>Loading....</div>;
}
