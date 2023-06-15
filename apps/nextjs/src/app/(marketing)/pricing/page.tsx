import { CheckCircle2 } from "lucide-react";
import { Balancer } from "react-wrap-balancer";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";

import type { RouterOutputs } from "~/trpc/server";
import { api } from "~/trpc/server";
import { SubscribeNow } from "./subscribe-now";

export const runtime = "edge";

export default async function PricingPage() {
  const plans = await api.stripe.plans.query();

  return (
    <main className="flex w-full flex-col items-center justify-center pt-16">
      <div className="z-10 min-h-[50vh] w-full max-w-7xl px-5 xl:px-0">
        <h1 className="font-cal text-7xl/[5rem]">Pricing</h1>
        <Balancer className="text-2xl">
          Simple pricing for all your needs. No hidden fees, no surprises.
        </Balancer>

        <div className="my-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </main>
  );
}

function CurrencyIcon(props: { currency: string }) {
  switch (props.currency) {
    case "usd":
      return <span>$</span>;
    case "eur":
      return <span>€</span>;
    default:
      return <span>{props.currency}</span>;
  }
}

function PricingCard(props: {
  plan: RouterOutputs["stripe"]["plans"][number];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.plan.name}</CardTitle>
        <div className="text-2xl font-bold">
          <CurrencyIcon currency={props.plan.currency} />
          {props.plan.amount / 100}
          <span className="text-base font-normal"> / month</span>
        </div>{" "}
        <CardDescription>{props.plan.description}</CardDescription>
      </CardHeader>

      <ul className="flex flex-col px-6 pb-6">
        {props.plan.preFeatures && (
          <li className="flex items-center pb-1">{props.plan.preFeatures}</li>
        )}
        {props.plan.features.map((feature) => (
          <li key={feature} className="flex items-center">
            <CheckCircle2 className="mr-2 h-6 w-6 fill-primary text-primary-foreground" />
            {feature}
          </li>
        ))}
      </ul>

      <CardFooter>
        <SubscribeNow planId={props.plan.id} />
      </CardFooter>
    </Card>
  );
}
