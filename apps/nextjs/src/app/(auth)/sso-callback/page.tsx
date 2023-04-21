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
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await new Promise((res) => {
        setTimeout(res, 1000);
      });
      try {
        await handleRedirectCallback(props.searchParams).catch((err) =>
          console.error("SSO handleRedirectCallback error", err),
        );
      } catch (e) {
        console.error("SSO handleRedirectCallback error", e);
      }
    })();
  }, [props, handleRedirectCallback]);
  return <div>Loading....</div>;
}
