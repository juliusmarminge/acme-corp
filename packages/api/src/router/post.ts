import { z } from "zod";

import { genId } from "@acme/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db
      .selectFrom("Post")
      .selectAll()
      .orderBy("id", "desc")
      .execute();
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .selectFrom("Post")
        .selectAll()
        .where("Post.id", "=", input.id)
        .executeTakeFirst();
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = genId();
      await ctx.db
        .insertInto("Post")
        .values({
          id,
          content: input.content,
          title: input.title,
          userId: ctx.auth.userId,
        })
        .execute();

      return ctx.db
        .selectFrom("Post")
        .selectAll()
        .where("Post.id", "=", id)
        .execute();
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.deleteFrom("Post").where("Post.id", "=", input).execute();
  }),
});
