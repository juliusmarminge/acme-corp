import Stripe from "stripe";

import { env } from "../../env.mjs";

export const stripe = new Stripe(env.STRIPE_API_KEY, {
  apiVersion: "2022-11-15",
  typescript: true,
});

export function stripePriceToSubscriptionPlan(priceId: string | undefined) {
  if (priceId === env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID) return "PRO";
  if (priceId === env.NEXT_PUBLIC_STRIPE_STD_MONTHLY_PRICE_ID)
    return "STANDARD";
  throw new Error(`Invalid price id: ${priceId}`);
}
