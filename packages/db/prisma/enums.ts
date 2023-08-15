export const ProjectTier = {
  FREE: "FREE",
  PRO: "PRO",
} as const;
export type ProjectTier = (typeof ProjectTier)[keyof typeof ProjectTier];
export const SubscriptionPlan = {
  FREE: "FREE",
  STANDARD: "STANDARD",
  PRO: "PRO",
} as const;
export type SubscriptionPlan =
  (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan];
