import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import * as z from "zod";

import { genId } from "@acme/db";

import { env } from "../env.mjs";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const stripe = new Stripe(env.STRIPE_API_KEY, {
  apiVersion: "2022-11-15",
  typescript: true,
});

function stripePriceToSubscriptionPlan(priceId: string | undefined) {
  if (priceId === env.STRIPE_PRO_MONTHLY_PRICE_ID) return "PRO";
  if (priceId === env.STRIPE_PRO_YEARLY_PRICE_ID) return "PRO";
  if (priceId === env.STRIPE_STD_MONTHLY_PRICE_ID) return "STANDARD";
  if (priceId === env.STRIPE_STD_YEARLY_PRICE_ID) return "STANDARD";
  throw new Error(`Invalid price id: ${priceId}`);
}

const webhookProcedure = publicProcedure.input(
  z.object({
    // From type Stripe.Event
    event: z.object({
      id: z.string(),
      account: z.string().nullish(),
      created: z.number(),
      data: z.object({
        object: z.record(z.any()),
      }),
      type: z.string(),
    }),
  }),
);

const webhookRouter = createTRPCRouter({
  sessionCompleted: webhookProcedure.mutation(async (opts) => {
    const session = opts.input.event.data.object as Stripe.Checkout.Session;
    if (typeof session.subscription !== "string") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Missing or invalid subscription id",
      });
    }
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription,
    );

    console.log("sessionCompleted", subscription);

    if (typeof subscription.customer !== "string") {
      return new Response("Missing or invalid customerId", { status: 400 });
    }

    const { userId } = subscription.metadata;

    const customer = await opts.ctx.db
      .selectFrom("Customer")
      .select("id")
      .where("stripeId", "=", subscription.customer)
      .executeTakeFirst();

    const subscriptionPlan = stripePriceToSubscriptionPlan(
      subscription.items.data[0]?.price.id,
    );

    if (customer) {
      return await opts.ctx.db
        .updateTable("Customer")
        .set({
          stripeId: subscription.customer,
          subscriptionId: subscription.id,
          paidUntil: new Date(subscription.current_period_end * 1000),
          plan: subscriptionPlan,
        })
        .execute();
    }

    await opts.ctx.db
      .insertInto("Customer")
      .values({
        id: genId(),
        clerkUserId: userId ?? "wh",
        stripeId: subscription.customer,
        subscriptionId: subscription.id,
        plan: subscriptionPlan,
        paidUntil: new Date(subscription.current_period_end * 1000),
        endsAt: new Date(subscription.current_period_end * 1000),
      })
      .execute();
  }),

  invoicePaymentSucceeded: webhookProcedure.mutation(async (opts) => {
    const invoice = opts.input.event.data.object as Stripe.Invoice;
    if (typeof invoice.subscription !== "string") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Missing or invalid subscription id",
      });
    }
    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription,
    );

    const subscriptionPlan = stripePriceToSubscriptionPlan(
      subscription.items.data[0]?.price.id,
    );

    console.log("invoicePaymentSucceeded", subscription);

    await opts.ctx.db
      .updateTable("Customer")
      .set({
        plan: subscriptionPlan,
        paidUntil: new Date(subscription.current_period_end * 1000),
      })
      .where("subscriptionId", "=", subscription.id)
      .execute();
  }),
});

export const stripeRouter = createTRPCRouter({
  webhooks: webhookRouter,

  createSession: protectedProcedure.mutation(async (opts) => {
    const { userId, user } = opts.ctx.auth;

    const customer = await opts.ctx.db
      .selectFrom("Customer")
      .select(["id", "plan", "stripeId"])
      .where("clerkUserId", "=", userId)
      .executeTakeFirst();

    const returnUrl = env.NEXTJS_URL + "/account";

    if (customer && customer.plan !== "FREE") {
      /**
       * User is subscribed, create a billing portal session
       */
      const session = await stripe.billingPortal.sessions.create({
        customer: customer.stripeId,
        return_url: returnUrl,
      });
      return { url: session.url };
    }

    /**
     * User is not subscribed, create a checkout session
     * Use existing email address if available
     */
    const email = user?.emailAddresses.find(
      (addr) => addr.id === user?.primaryEmailAddressId,
    )?.emailAddress;

    const session = await stripe.checkout.sessions.create({
      success_url: returnUrl,
      cancel_url: returnUrl,
      mode: "subscription",
      customer_email: email,
      metadata: { userId },
      line_items: [{ price: env.STRIPE_PRO_MONTHLY_PRICE_ID, quantity: 1 }],
    });

    return { url: session.url };
  }),
});
