import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { inviteOrgMemberSchema } from "../../validators";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const organizationsRouter = createTRPCRouter({
  listMembers: protectedProcedure.query(async (opts) => {
    const { orgId } = opts.ctx.auth;
    if (!orgId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const members =
      await clerkClient.organizations.getOrganizationMembershipList({
        organizationId: orgId,
      });

    return members.map((member) => ({
      id: member.id,
      email: member.publicUserData?.identifier ?? "",
      role: member.role,
      joinedAt: member.createdAt,
      avatarUrl: member.publicUserData?.imageUrl,
      name: [
        member.publicUserData?.firstName,
        member.publicUserData?.lastName,
      ].join(" "),
    }));
  }),

  deleteMember: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async (opts) => {
      const { orgId, orgRole } = opts.ctx.auth;
      if (!orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (orgRole !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can delete members",
        });
      }

      const member =
        await clerkClient.organizations.deleteOrganizationMembership({
          organizationId: orgId,
          userId: opts.input.userId,
        });

      return { success: true, memberName: member.publicUserData?.firstName };
    }),

  inviteMember: protectedProcedure
    .input(inviteOrgMemberSchema)
    .mutation(async (opts) => {
      const { orgId, orgRole } = opts.ctx.auth;
      if (!orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (orgRole !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can delete members",
        });
      }

      const { email } = opts.input;
      const users = await clerkClient.users.getUserList({
        emailAddress: [email],
      });
      const user = users[0];

      if (users.length === 0 || !user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (users.length > 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Multiple users found with that email address",
        });
      }

      const member =
        await clerkClient.organizations.createOrganizationMembership({
          organizationId: orgId,
          userId: user.id,
          role: opts.input.role,
        });

      const { firstName, lastName } = member.publicUserData ?? {};
      return { name: [firstName, lastName].join(" ") };
    }),
});
