import * as z from "zod";

import { env } from "./src/env.mjs";

/**
 * Shared validators used in both the frontend and backend
 */

export const createProjectSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  url: z.string().url("Must be a valid URL").optional(),
});
export type CreateProject = z.infer<typeof createProjectSchema>;

export const purchaseOrgSchema = z.object({
  orgName: z.string().min(5, "Name must be at least 5 characters"),
  planId: z
    .string()
    .refine(
      (str) =>
        [
          env.STRIPE_STD_MONTHLY_PRICE_ID,
          env.STRIPE_PRO_MONTHLY_PRICE_ID,
        ].includes(str),
      "Invalid planId",
    ),
});
export type PurchaseOrg = z.infer<typeof purchaseOrgSchema>;
