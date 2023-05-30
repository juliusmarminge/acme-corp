import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

import { appRouter, createTRPCContext } from "@acme/api";
import { stripe } from "@acme/api/stripe-client";

import { env } from "~/env.mjs";

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("Stripe-Signature");
  if (!signature) return new Response("No signature", { status: 400 });

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    /**
     * Forward to tRPC API to handle the webhook event
     */
    const ctx = createTRPCContext({ req, resHeaders: {} as Headers });
    const caller = appRouter.createCaller(ctx);

    switch (event.type) {
      case "checkout.session.completed":
        await caller.stripe.webhooks.sessionCompleted({ event });
        break;
      case "invoice.payment_succeeded":
        await caller.stripe.webhooks.invoicePaymentSucceeded({ event });
        break;
      case "invoice.payment_failed":
        // TODO: Handle failed payments
        break;
      case "customer.subscription.deleted":
        await caller.stripe.webhooks.customerSubscriptionDeleted({ event });
        break;
      case "customer.subscription.updated":
        await caller.stripe.webhooks.customerSubscriptionUpdated({ event });
        break;

      default:
        throw new Error(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    if (error instanceof TRPCError) {
      const errorCode = getHTTPStatusCodeFromError(error);
      console.error("Error in tRPC webhook handler", error);
      return new Response(error.message, { status: errorCode });
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Webhook Error: ${message}`, {
      status: 400,
    });
  }

  return new Response(null, { status: 200 });
}
