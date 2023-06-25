import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  server: {
    NEXTJS_URL: z.preprocess(
      (str) =>
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : str,
      process.env.VERCEL_URL ? z.string().min(1) : z.string().url(),
    ),

    STRIPE_API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_STRIPE_STD_PRODUCT_ID: z.string(),
    NEXT_PUBLIC_STRIPE_STD_MONTHLY_PRICE_ID: z.string(),
    NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID: z.string(),
    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_STRIPE_STD_PRODUCT_ID:
      process.env.NEXT_PUBLIC_STRIPE_STD_PRODUCT_ID,
    NEXT_PUBLIC_STRIPE_STD_MONTHLY_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_STD_MONTHLY_PRICE_ID,
    NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID:
      process.env.NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID,
    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
