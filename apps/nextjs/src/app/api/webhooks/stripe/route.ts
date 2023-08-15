import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import type { Stripe } from "@acme/stripe";
import { handleEvent, stripe } from "@acme/stripe";

import { env } from "~/env.mjs";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("Stripe-Signature")!;

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    ) as Stripe.DiscriminatedEvent;

    await handleEvent(event);

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
