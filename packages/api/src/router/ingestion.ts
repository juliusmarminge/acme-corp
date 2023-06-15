import { File } from "undici";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { genId } from "@acme/db";

import {
  createTRPCRouter,
  protectedApiFormDataProcedure,
  protectedProcedure,
} from "../trpc";

// @ts-expect-error - zfd needs a File on the global scope
globalThis.File = File;

const myFileValidator = z.preprocess(
  // @ts-expect-error - this is a hack. not sure why it's needed since it should already be a File
  (file: File) =>
    new File([file], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    }),
  zfd.file(z.instanceof(File)),
);

/**
 * FIXME: Not all of these have to run on lambda, just the upload one
 */

export const ingestionRouter = createTRPCRouter({
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const ingestion = await opts.ctx.db
        .selectFrom("Ingestion")
        .select(["id", "createdAt", "hash", "schema", "origin", "parent"])
        .where("id", "=", opts.input.id)
        .executeTakeFirstOrThrow();

      return ingestion;
    }),

  list: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        limit: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      let query = opts.ctx.db
        .selectFrom("Ingestion")
        .select(["id", "createdAt", "hash"])
        .where("projectId", "=", opts.input.projectId);

      if (opts.input.limit) {
        query = query.limit(opts.input.limit).orderBy("createdAt", "desc");
      }
      const ingestions = await query.execute();

      return ingestions.map((ingestion) => ({
        ...ingestion,
        adds: Math.floor(Math.random() * 10),
        subs: Math.floor(Math.random() * 10),
      }));
    }),
  upload: protectedApiFormDataProcedure
    .input(
      zfd.formData({
        hash: zfd.text(),
        parent: zfd.text().optional(),
        origin: zfd.text(),
        schema: myFileValidator,
      }),
    )
    .mutation(async (opts) => {
      const fileContent = await opts.input.schema.text();

      const id = "ingest_" + genId();
      await opts.ctx.db
        .insertInto("Ingestion")
        .values({
          id,
          projectId: opts.ctx.apiKey.projectId,
          hash: opts.input.hash,
          parent: opts.input.parent,
          origin: opts.input.origin,
          schema: fileContent,
          apiKeyId: opts.ctx.apiKey.id,
        })
        .executeTakeFirst();

      return { status: "ok" };
    }),
});
