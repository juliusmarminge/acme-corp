import { currentUser } from "@clerk/nextjs";
import * as z from "zod";

import { purchaseOrgSchema } from "../../../validators";
import { env } from "../../env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { stripe } from "./shared";
import { webhookRouter } from "./webhooks";

export const stripeRouter = createTRPCRouter({
  webhooks: webhookRouter,

  createSession: protectedProcedure
    .input(z.object({ planId: z.string() }))
    .mutation(async (opts) => {
      const { userId } = opts.ctx.auth;

      const customer = await opts.ctx.db
        .selectFrom("Customer")
        .select(["id", "plan", "stripeId"])
        .where("clerkUserId", "=", userId)
        .executeTakeFirst();

      const returnUrl = env.NEXTJS_URL + "/dashboard";

      if (customer && customer.plan !== "FREE") {
        /**
         * User is subscribed, create a billing portal session
         */
        const session = await stripe.billingPortal.sessions.create({
          customer: customer.stripeId,
          return_url: returnUrl,
        });
        return { success: true as const, url: session.url };
      }

      /**
       * User is not subscribed, create a checkout session
       * Use existing email address if available
       */
      const user = await currentUser();
      const email = user?.emailAddresses.find(
        (addr) => addr.id === user?.primaryEmailAddressId,
      )?.emailAddress;

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: email,
        client_reference_id: userId,
        subscription_data: { metadata: { userId } },
        cancel_url: returnUrl,
        success_url: returnUrl,
        line_items: [
          { price: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID, quantity: 1 },
        ],
      });

      if (!session.url) return { success: false as const };
      return { success: true as const, url: session.url };
    }),

  plans: publicProcedure.query(async () => {
    const proPrice = await stripe.prices.retrieve(
      env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
    );
    const stdPrice = await stripe.prices.retrieve(
      env.NEXT_PUBLIC_STRIPE_STD_MONTHLY_PRICE_ID,
    );

    return [
      {
        id: stdPrice.id,
        name: "Standard",
        description: "For individuals",
        amount: stdPrice.unit_amount!,
        currency: stdPrice.currency,
        features: ["Invite up to 1 team member", "Lorem ipsum dolor sit amet"],
      },
      {
        id: proPrice.id,
        name: "Pro",
        description: "For teams",
        amount: proPrice.unit_amount!,
        currency: proPrice.currency,
        preFeatures: "Everything in standard, plus",
        features: ["Invite up to 5 team members", "Unlimited projects"],
      },
    ];
  }),

  purchaseOrg: protectedProcedure
    .input(purchaseOrgSchema)
    .mutation(async (opts) => {
      const { userId } = opts.ctx.auth;
      const { orgName, planId } = opts.input;

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        client_reference_id: userId,
        subscription_data: {
          metadata: { userId, organizationName: orgName },
        },
        success_url: `${env.NEXTJS_URL}/dashboard`, // TODO: Maybe onboarding?        cancel_url: env.NEXTJS_URL,
        line_items: [{ price: planId, quantity: 1 }],
      });

      if (!session.url) return { success: false as const };
      return { success: true as const, url: session.url };
    }),
});
