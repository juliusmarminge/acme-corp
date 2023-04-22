"use client";

import * as React from "react";
import { useSignIn } from "@clerk/nextjs";
import { type OAuthStrategy } from "@clerk/types";

import { Button } from "@acme/ui/button";
import { Icons } from "@acme/ui/icons";
import { useToast } from "@acme/ui/use-toast";

export function OAuthSignIn() {
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null);
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { toast } = useToast();

  const oauthSignIn = async (provider: OAuthStrategy) => {
    if (!signInLoaded) return null;
    try {
      setIsLoading(provider);
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
      console.log("oauthSignIn done?");
    } catch (cause) {
      console.error(cause);
      setIsLoading(null);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong, please try again.",
      });
    }
    console.log("oauthSignIn done2?");
    console.log(JSON.stringify(signIn, null, 4));
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        className="bg-background"
        onClick={() => oauthSignIn("oauth_github")}
      >
        {isLoading === "oauth_github" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}
        Github
      </Button>
      <Button
        variant="outline"
        className="bg-background"
        onClick={() => oauthSignIn("oauth_google")}
      >
        {isLoading === "oauth_google" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
    </div>
  );
}
