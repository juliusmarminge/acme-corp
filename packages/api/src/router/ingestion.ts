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

export const ingestionRouter = createTRPCRouter({
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
        .selectAll()
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
        schema: myFileValidator,
      }),
    )
    .mutation(async (opts) => {
      const fileContent = await opts.input.schema.text();

      // Could be inferred from the API key but nice to
      // have it directly on the ingestion itself
      const { projectId } = await opts.ctx.db
        .selectFrom("ApiKey")
        .select("projectId")
        .where("id", "=", opts.ctx.apiKeyId)
        .executeTakeFirstOrThrow();

      const id = "ingest_" + genId();
      await opts.ctx.db
        .insertInto("Ingestion")
        .values({
          id,
          projectId,
          hash: opts.input.hash,
          schema: fileContent,
          apiKeyId: opts.ctx.apiKeyId,
        })
        .executeTakeFirst();

      return { status: "ok" };
    }),
});
