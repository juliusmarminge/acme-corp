import { api } from "~/trpc/server";
import { SubscriptionForm } from "./subscription-form";

export default async function BillingPage() {
  const subscription = await api.auth.mySubscription.query();

  return (
    <div>
      <h1>Billing</h1>

      {subscription ? (
        <p>
          You are currently on the <strong>{subscription.plan}</strong> plan.
          Your subscription will renew on{" "}
          <strong>{subscription.endsAt?.toLocaleDateString()}</strong>.
        </p>
      ) : (
        <p>You are not subscribed to any plan.</p>
      )}

      <SubscriptionForm />
    </div>
  );
}
