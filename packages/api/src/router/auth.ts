import { clerkClient } from "@clerk/nextjs";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  mySubscription: protectedProcedure.query(async (opts) => {
    const customer = await opts.ctx.db
      .selectFrom("Customer")
      .select(["plan", "endsAt"])
      .where("clerkUserId", "=", opts.ctx.auth.userId)
      .executeTakeFirst();

    if (!customer) return null;

    return { plan: customer.plan ?? null, endsAt: customer.endsAt ?? null };
  }),
  listOrganizations: protectedProcedure.query(async (opts) => {
    const memberships = await clerkClient.users.getOrganizationMembershipList({
      userId: opts.ctx.auth.userId,
    });

    return memberships.map(({ organization }) => ({
      id: organization.id,
      name: organization.name,
      image: organization.imageUrl,
    }));
  }),
});
