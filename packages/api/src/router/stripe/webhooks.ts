import clerkClient from "@clerk/clerk-sdk-node";
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

    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;
    const { userId, organizationName } = subscription.metadata;

    const customer = await opts.ctx.db
      .selectFrom("Customer")
      .select("id")
      .where("stripeId", "=", customerId)
      .executeTakeFirst();

    const subscriptionPlan = stripePriceToSubscriptionPlan(
      subscription.items.data[0]?.price.id,
    );

    /**
     * User is already subscribed, update their info
     */
    if (customer) {
      return await opts.ctx.db
        .updateTable("Customer")
        .where("id", "=", customer.id)
        .set({
          stripeId: customerId,
          subscriptionId: subscription.id,
          paidUntil: new Date(subscription.current_period_end * 1000),
          plan: subscriptionPlan,
        })
        .execute();
    }

    /**
     * User is not subscribed, create a new customer and org
     */
    const organization = await clerkClient.organizations.createOrganization({
      createdBy: userId!,
      name: organizationName!,
    });

    await opts.ctx.db
      .insertInto("Customer")
      .values({
        id: genId(),
        clerkUserId: userId ?? "wh",
        clerkOrganizationId: organization.id,
        stripeId: customerId,
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

    await opts.ctx.db
      .updateTable("Customer")
      .where("subscriptionId", "=", subscription.id)
      .set({
        plan: subscriptionPlan,
        paidUntil: new Date(subscription.current_period_end * 1000),
      })
      .execute();
  }),

  customerSubscriptionDeleted: webhookProcedure.mutation(async (opts) => {
    const subscription = opts.input.event.data.object as Stripe.Subscription;
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;

    await opts.ctx.db
      .updateTable("Customer")
      .where("stripeId", "=", customerId)
      .set({
        subscriptionId: null,
        plan: "FREE",
        paidUntil: null,
      })
      .execute();
  }),

  customerSubscriptionUpdated: webhookProcedure.mutation(async (opts) => {
    const subscription = opts.input.event.data.object as Stripe.Subscription;
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;

    const subscriptionPlan = stripePriceToSubscriptionPlan(
      subscription.items.data[0]?.price.id,
    );

    await opts.ctx.db
      .updateTable("Customer")
      .where("stripeId", "=", customerId)
      .set({
        plan: subscriptionPlan,
        paidUntil: new Date(subscription.current_period_end * 1000),
      })
      .execute();
  }),
});
