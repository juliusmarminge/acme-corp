import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";
import * as z from "zod";

import { genId } from "@acme/db";

import { createTRPCRouter, publicProcedure } from "../../trpc";
import { stripe, stripePriceToSubscriptionPlan } from "./shared";

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

export const webhookRouter = createTRPCRouter({
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

  customerSubscriptionDeleted: webhookProcedure.mutation(async () => {
    // todo
  }),
  customerSubscriptionUpdated: webhookProcedure.mutation(async () => {
    // todo
  }),
});
