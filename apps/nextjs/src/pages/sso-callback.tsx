import { useEffect } from "react";
import { ClerkProvider, useClerk } from "@clerk/nextjs";
import type { HandleOAuthCallbackParams } from "@clerk/types";

export const runtime = "experimental-edge";

/**
 * TODO: Check if this can be a server component or api route
 */
function SSOCallback(props: HandleOAuthCallbackParams) {
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {
    void handleRedirectCallback(props);
  }, [props, handleRedirectCallback]);
  return <div>Loading....</div>;
}

export default function Wrapped(params: HandleOAuthCallbackParams) {
  return (
    <ClerkProvider>
      <SSOCallback {...params} />
    </ClerkProvider>
  );
}
