"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { type OAuthStrategy } from "@clerk/types";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Icons } from "@acme/ui/icons";
import { Input } from "@acme/ui/input";
import { useToast } from "@acme/ui/use-toast";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const { signIn, isLoaded: signInLoaded, setSession } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const router = useRouter();
  const { toast } = useToast();

  const signInWithLink = async () => {
    if (!signInLoaded || !email) return null;
    // the catch here prints out the error.
    // if the user doesn't exist we will return a 422 in the network response.
    // so push that to the sign up.
    setIsLoading(true);
    await signIn
      .create({
        strategy: "email_link",
        identifier: email,
        redirectUrl: `${window.location.origin}/`,
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });

    const firstFactor = signIn.supportedFirstFactors.find(
      (f) => f.strategy === "email_link",
    );

    if (firstFactor) {
      // this error needs type fixing, because typescript is dumb.
      const { emailAddressId } = firstFactor as { emailAddressId: string };
      const { startMagicLinkFlow, cancelMagicLinkFlow } =
        signIn.createMagicLinkFlow();

      setIsLoading(false);
      setEmail("");
      toast({
        title: "Email Sent",
        description: "Check your inbox for a verification email.",
      });
      const response = await startMagicLinkFlow({
        emailAddressId: emailAddressId,
        redirectUrl: `${window.location.origin}/`,
      });

      const verification = response.firstFactorVerification;

      if (verification.status === "expired") {
        toast({
          variant: "destructive",
          title: "Link Expired",
          description: "Link expired, please try again.",
        });
      }

      cancelMagicLinkFlow();

      if (response.status === "complete") {
        await setSession(
          response.createdSessionId,
          () => void router.push(`/dashboard`),
        );
        setIsLoading(false);
      }
    } else {
      if (!signUpLoaded) return null;
      await signUp.create({
        emailAddress: email,
      });
      const { startMagicLinkFlow } = signUp.createMagicLinkFlow();

      const response = await startMagicLinkFlow({
        redirectUrl: `${window.location.origin}/`,
      });

      if (response.status === "complete") {
        await setSession(signUp.createdSessionId, () => router.push("/"));
        return;
      }
    }
  };

  const oauthSignIn = async (provider: OAuthStrategy) => {
    if (!signInLoaded) return null;
    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (cause) {
      console.error(cause);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Input
            name="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <Button disabled={isLoading} onClick={() => signInWithLink()}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Sign In with Email
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button variant="outline" onClick={() => oauthSignIn("oauth_github")}>
          <Icons.gitHub className="mr-2 h-4 w-4" />
          Github
        </Button>
        <Button variant="outline" onClick={() => oauthSignIn("oauth_google")}>
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </div>
  );
}
