import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";

import { api } from "~/trpc/server";
import { DashboardShell } from "../../_components/dashboard-shell";
import { SubscriptionForm } from "./subscription-form";

export default function BillingPage() {
  return (
    <DashboardShell
      title="Billing"
      description="Manage your subscription and billing details"
      className="space-y-4"
    >
      <SubscriptionCard />

      <UsageCard />
    </DashboardShell>
  );
}

async function SubscriptionCard() {
  const subscription = await api.auth.mySubscription.query();

  return (
    <Card>
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
