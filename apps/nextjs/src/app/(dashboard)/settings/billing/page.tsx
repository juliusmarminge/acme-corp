import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";

import { api } from "~/trpc/server";
import { SubscriptionForm } from "./subscription-form";

export default function BillingPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold leading-none tracking-tight">
        Billing
      </h1>
      <h2 className="text-base text-muted-foreground">
        Manage your subscription and billing details
      </h2>

      <SubscriptionCard />

      <UsageCard />
    </div>
  );
}

async function SubscriptionCard() {
  const subscription = await api.auth.mySubscription.query();

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        {subscription ? (
          <p>
            You are currently on the <strong>{subscription.plan}</strong> plan.
            Your subscription will renew on{" "}
            <strong>{subscription.endsAt?.toLocaleDateString()}</strong>.
          </p>
        ) : (
          <p>You are not subscribed to any plan.</p>
        )}
      </CardContent>
      <CardFooter>
        <SubscriptionForm hasSubscription={!!subscription} />
      </CardFooter>
    </Card>
  );
}

function UsageCard() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Usage</CardTitle>
      </CardHeader>
      <CardContent>TODO</CardContent>
    </Card>
  );
}
