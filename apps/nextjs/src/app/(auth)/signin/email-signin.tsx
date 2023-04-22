"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useSignUp } from "@clerk/nextjs/app-beta/client";

import { Button } from "@acme/ui/button";
import { Icons } from "@acme/ui/icons";
import { Input } from "@acme/ui/input";
import { useToast } from "@acme/ui/use-toast";

export function EmailSignIn() {
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
        console.log("sign-in error", JSON.stringify(error));
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
      })
        .catch(() => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Something went wrong, please try again.",
          });
        })
        .then((res) => res);

      const verification = response?.firstFactorVerification;

      if (verification?.status === "expired") {
        toast({
          variant: "destructive",
          title: "Link Expired",
          description: "Link expired, please try again.",
        });
      }

      cancelMagicLinkFlow();

      if (response?.status === "complete") {
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

      setIsLoading(false);
      setEmail("");
      toast({
        title: "Email Sent",
        description: "Check your inbox for a verification email.",
      });
      const response = await startMagicLinkFlow({
        redirectUrl: `${window.location.origin}/`,
      })
        .catch(() => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Something went wrong, please try again.",
          });
        })
        .then((res) => res);

      if (response?.status === "complete") {
        await setSession(signUp.createdSessionId, () => router.push("/"));
        return;
      }
    }
  };

  return (
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
          className="bg-background"
        />
      </div>
      <Button disabled={isLoading} onClick={() => signInWithLink()}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Sign In with Email
      </Button>
    </div>
  );
}
