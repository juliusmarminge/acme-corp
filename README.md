# Acme Corp

> **Warning**
> This is a work-in-progress and not the finished product.
>
> Feel free to leave feature suggestions but please don't open issues for bugs or support requests just yet.

<img width="1758" alt="landing" src="https://user-images.githubusercontent.com/51714798/233038030-486d5006-5e6b-47c4-841e-fc321bb9e37e.png">

## Installation

You can use the `create-turbo` CLI to bootstrap your project using this template:

```bash
npx create-turbo@latest -e https://github.com/juliusmarminge/acme-corp
```

## About

This project features the next-generation stack for building fullstack application. It's structured as a monorepo with a shared API using tRPC. Built on the new app router in Next.js 13 with React Server Components.

- For database querying, [Kysely](https://kysely.dev) is used as a query builder whilst remaining [Prisma](https://prisma.io) as a schema management tool. (This means it's fully edge-ready!). To keep a good DX, we use a custom setup with kysely-prisma-generator to pull out all the prisma types, and then a [post-generate script](./packages/db/prisma/postgenerate.ts) to create a fully typesafe db client using database.js from [PlanetScale](https://planetscale.com).
- This project uses [Clerk](https://clerk.com) as it's authentication provider.
- Awesome UI components from [shadcn/ui](https://ui.shadcn.com)

## References

The stack originates from [create-t3-app](https://github.com/t3-oss/create-t3-app).

A [blog post](https://jumr.dev/blog/t3-turbo) where I wrote how to migrate a T3 app into this.

## Questions?

<a href="https://cal.com/julius/quick-chat?utm_source=banner&utm_campaign=oss"><img alt="Book us with Cal.com" src="https://cal.com/book-with-cal-dark.svg" /></a>
