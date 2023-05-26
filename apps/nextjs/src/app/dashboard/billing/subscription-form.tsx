"use client";

import { Button } from "@acme/ui/button";
import { Card, CardContent, CardTitle } from "@acme/ui/card";

import { api } from "~/trpc/client";

export function SubscriptionForm() {
  async function createSession() {
    const { url } = await api.stripe.createSession.mutate();
    if (url) window.location.href = url;
  }

  return (
    <Card>
      <CardTitle>Subscription</CardTitle>
      <CardContent>
        <Button onClick={createSession}>Upgrade!</Button>
      </CardContent>
    </Card>
  );
}
