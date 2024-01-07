import { Stripe } from "stripe";

import { env } from "./env.mjs";

export * from "./plans";
export * from "./webhooks";

export type { Stripe };

export const stripe = new Stripe(env.STRIPE_API_KEY, {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  apiVersion: "2023-08-16",
  typescript: true,
});
