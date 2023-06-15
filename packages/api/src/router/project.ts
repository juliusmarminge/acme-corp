import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { genId } from "@acme/db";

import {
  createApiKeySchema,
  createProjectSchema,
  transferToOrgSchema,
} from "../../validators";
import {
  createTRPCRouter,
  protectedAdminProcedure,
  protectedProcedure,
} from "../trpc";

const PROJECT_LIMITS = {
  FREE: 1,
  PRO: 3,
} as const;

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async (opts) => {
      const { userId, orgId } = opts.ctx.auth;
      const { name } = opts.input;

      // Check if limit is reached
      let query = opts.ctx.db
        .selectFrom("Project")
        .select(({ fn }) => [fn.count<number>("id").as("projects")]);
      if (orgId) {
        query = query.where("organizationId", "=", orgId);
      } else {
        query = query.where("userId", "=", userId);
      }
      const projects = (await query.executeTakeFirst())?.projects ?? 0;

      // FIXME: Don't hardcode the limit to PRO
      if (projects >= PROJECT_LIMITS.PRO) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Limit reached" });
      }

      const projectId = "project_" + genId();

      await opts.ctx.db
        .insertInto("Project")
        .values({
          id: projectId,
          name,
          userId: orgId ? null : userId,
          organizationId: orgId,
        })
        .execute();

      return projectId;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const { userId, orgId } = opts.ctx.auth;

      const deleteQuery = opts.ctx.db
        .deleteFrom("Project")
        .where("id", "=", opts.input.id);

      // TODO: Check billing etc

      if (orgId) {
        // TODO: Check permissions

        return await deleteQuery.where("organizationId", "=", orgId).execute();
      }

      return await deleteQuery.where("userId", "=", userId).execute();
    }),

  transferToPersonal: protectedAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const project = await opts.ctx.db
        .selectFrom("Project")
        .select(["id", "userId", "organizationId"])
        .where("id", "=", opts.input.id)
        .executeTakeFirst();

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (!project.organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Project is already personal",
        });
      }

      await opts.ctx.db
        .updateTable("Project")
        .set({
          userId: opts.ctx.auth.userId,
          organizationId: null,
        })
        .where("id", "=", project.id)
        .execute();
    }),

  transferToOrganization: protectedProcedure
    .input(transferToOrgSchema)
    .mutation(async (opts) => {
      const { userId, orgId: userOrgId, orgRole } = opts.ctx.auth;
      const { orgId: targetOrgId } = opts.input;

      const orgs = await clerkClient.users.getOrganizationMembershipList({
        userId: userId,
      });
      const org = orgs.find((org) => org.organization.id === targetOrgId);

      if (!org) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You're not a member of the target organization",
        });
      }

      const project = await opts.ctx.db
        .selectFrom("Project")
        .select(["id", "userId", "organizationId"])
        .where(({ cmpr, and, or }) =>
          and([
            cmpr("id", "=", opts.input.projectId),
            or([
              cmpr("userId", "=", userId),
              cmpr("organizationId", "=", userOrgId ?? ""),
            ]),
          ]),
        )
        .executeTakeFirst();

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (project.organizationId === targetOrgId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Project is already in the target organization",
        });
      }

      if (
        project.organizationId &&
        project.organizationId !== userOrgId &&
        orgRole !== "admin"
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be an admin to transfer this project",
        });
      }

      await opts.ctx.db
        .updateTable("Project")
        .set({
          userId: null,
          organizationId: targetOrgId,
        })
        .where("id", "=", project.id)
        .execute();
    }),

  listByActiveWorkspace: protectedProcedure.query(async (opts) => {
    const { userId, orgId } = opts.ctx.auth;

    let query = opts.ctx.db
      .selectFrom("Project")
      .select(["id", "name", "url", "tier"]);
    if (orgId) {
      query = query.where("organizationId", "=", orgId);
    } else {
      query = query.where("userId", "=", userId);
    }

    const projects = await query.execute();

    // FIXME: Don't hardcode the limit to PRO
    return {
      projects,
      limit: PROJECT_LIMITS.PRO,
      limitReached: projects.length >= PROJECT_LIMITS.PRO,
    };
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const { userId } = opts.ctx.auth;
      const { id } = opts.input;

      const orgs = await clerkClient.users.getOrganizationMembershipList({
        userId: userId,
      });
      const orgIds = orgs.map((org) => org.organization.id);

      // Verify the user has access to the project
      const query = opts.ctx.db
        .selectFrom("Project")
        .select(["id", "name", "url", "tier", "organizationId"])
        .where(({ cmpr, and, or }) =>
          and([
            cmpr("id", "=", id),
            orgIds.length > 0
              ? or([
                  cmpr("userId", "=", userId),
                  cmpr("organizationId", "in", orgIds),
                ])
              : cmpr("userId", "=", userId),
          ]),
        );

      const project = await query.executeTakeFirst();
      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return project;
    }),

  listApiKeys: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async (opts) => {
      const { userId } = opts.ctx.auth;
      const { projectId } = opts.input;

      const apiKeys = await opts.ctx.db
        .selectFrom("ApiKey")
        .select([
          "id",
          "name",
          "key",
          "createdAt",
          "lastUsed",
          "expiresAt",
          "revokedAt",
        ])
        .where("projectId", "=", projectId)
        .where("clerkUserId", "=", userId)
        // first active, then expired, then revoked
        .orderBy((eb) =>
          eb
            .case()
            .when("revokedAt", "is not", null)
            .then(3)
            .when(
              eb.and([
                eb.cmpr("expiresAt", "is not", null),
                eb.cmpr("expiresAt", "<", new Date()),
              ]),
            )
            .then(2)
            .else(1)
            .end(),
        )
        .orderBy("createdAt", "desc")
        .execute();

      // TODO: Project admins should maybe be able to see all keys for the project?

      return apiKeys;
    }),

  createApiKey: protectedProcedure
    .input(createApiKeySchema)
    .mutation(async (opts) => {
      const projectId = opts.input.projectId;
      const userId = opts.ctx.auth.userId;

      // Verify the user has access to the project
      const project = await opts.ctx.db
        .selectFrom("Project")
        .select(["id", "name", "userId", "organizationId"])
        .where("id", "=", projectId)
        .executeTakeFirst();

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (project.userId && project.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this project",
        });
      }

      if (project.organizationId) {
        const orgs = await clerkClient.users.getOrganizationMembershipList({
          userId,
        });
        const isMemberInProjectOrg = orgs.some(
          (org) => org.organization.id === project.organizationId,
        );

        if (!isMemberInProjectOrg) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this project",
          });
        }
      }

      // Generate the key
      const apiKey = "sk_live_" + genId();
      const apiKeyId = "api_key_" + genId();
      await opts.ctx.db
        .insertInto("ApiKey")
        .values({
          id: apiKeyId,
          name: opts.input.name,
          key: apiKey,
          expiresAt: opts.input.expiresAt,
          projectId: opts.input.projectId,
          clerkUserId: userId,
        })
        .execute();

      return apiKey;
    }),

  revokeApiKeys: protectedProcedure
    .input(z.object({ ids: z.string().array() }))
    .mutation(async (opts) => {
      const { userId } = opts.ctx.auth;

      const result = await opts.ctx.db
        .updateTable("ApiKey")
        .set({ revokedAt: new Date() })
        .where("id", "in", opts.input.ids)
        .where("clerkUserId", "=", String(userId))
        .where("revokedAt", "is", null)
        .executeTakeFirst();

      if (result.numUpdatedRows === BigInt(0)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "API key not found",
        });
      }

      return { success: true, numRevoked: result.numUpdatedRows };
    }),

  rollApiKey: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const apiKey = await opts.ctx.db
        .selectFrom("ApiKey")
        .select(["id"])
        .where("id", "=", opts.input.id)
        .where("clerkUserId", "=", opts.ctx.auth.userId)
        .executeTakeFirst();

      if (!apiKey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "API key not found",
        });
      }

      const newKey = "sk_live_" + genId();
      await opts.ctx.db
        .updateTable("ApiKey")
        .set({ key: newKey })
        .where("id", "=", opts.input.id)
        .execute();

      return newKey;
    }),
});
