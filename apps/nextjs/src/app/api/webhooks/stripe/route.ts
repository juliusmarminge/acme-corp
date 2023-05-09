import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { z } from "zod";

import { db } from "@acme/db";

import { stripe } from "~/utils/stripe";
import { env } from "~/env.mjs";

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("Stripe-Signature");

  if (!signature) {
    return NextResponse.json("No signature", { status: 400 });
  }

  // Verify the event is from Stripe.
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(`Webhook Error: ${message}`, {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (typeof session.subscription !== "string") {
    return NextResponse.json("No subscription", { status: 400 });
  }

  switch(event.type) {
    case "checkout.session.completed":
      break;
    case "invoice.payment_succeeded":
      break;
    default:
      return NextResponse.json("Invalid event type", { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription,
    );

    if (!subscription.customer) {
      return NextResponse.json("Missing customerId", { status: 400 });
    }

    // Update the user stripe into in our database.
    // Since this is the initial subscription, we need to update
    // the subscription id and customer id.
    await db.user.update({
      where: {
        id: session?.metadata?.userId,
      },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer,
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription,
    );

    // Update the price id and set the new period end.
    await db.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
      },
    });
  }

  return NextResponse.json(null, { status: 200 });
}
