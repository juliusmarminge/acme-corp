// Generated by prisma/post-generate.ts

import { ColumnType, Generated, Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
import { nanoid } from "nanoid";

export type Post = {
  id: string;
  userId: string;
  title: string;
  content: string;
};

export type Database = {
  Post: Post;
};

export const db = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    url: process.env.DATABASE_URL,
  }),
});

export const genId = nanoid;
