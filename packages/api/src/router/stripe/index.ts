import { env } from "../../env.mjs";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { stripe } from "./shared";
import { webhookRouter } from "./webhooks";

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
