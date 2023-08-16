# Acme Corp

> **Warning**
> This is a work-in-progress and not the finished product.
>
> Feel free to leave feature suggestions but please don't open issues for bugs or support requests just yet.

## About

This project features the next-generation stack for building fullstack application. It's structured as a monorepo with a shared API using tRPC. Built on the new app router in Next.js 13 with React Server Components.

- For database querying, [Kysely](https://kysely.dev) is used as a query builder whilst remaining [Prisma](https://prisma.io) as a schema management tool. (This means it's fully edge-ready!). To keep a good DX, we use a custom setup with kysely-prisma-generator to pull out all the prisma types, and then a [post-generate script](./packages/db/prisma/postgenerate.ts) to create a fully typesafe db client using database.js from [PlanetScale](https://planetscale.com).
- This project uses [Clerk](https://clerk.com) as it's authentication provider.
- Awesome UI components from [shadcn/ui](https://ui.shadcn.com)

## Installation

There are two ways of initializing an app using the `acme-corp` starter. You can either use this repository as a template:

![use-as-template](https://github.com/t3-oss/create-t3-turbo/assets/51714798/bb6c2e5d-d8b6-416e-aeb3-b3e50e2ca994)

or use Turbo's CLI to init your project:

```bash
npx create-turbo@latest -e https://github.com/juliusmarminge/acme-corp
```

## Quick Start

> **Note**
> The [db](./packages/db) package is preconfigured to use PlanetScale and is edge-ready with the [database.js](https://github.com/planetscale/database-js) driver. If you're using something else, make the necesary modifications to the [Kysely client](./packages/db/index.ts).

To get it running, follow the steps below:

### 1. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env.local

# Push the Prisma schema to the database
pnpm db:push
```

### 2. Configure Expo `dev`-script

> **Warning**
> The Expo app is still stock from `create-t3-turbo` and haven't yet gotten any attention.
>
> We will get their in due time!

#### Use iOS Simulator

1. Make sure you have XCode and XCommand Line Tools installed [as shown on expo docs](https://docs.expo.dev/workflow/ios-simulator).

   > **NOTE:** If you just installed XCode, or if you have updated it, you need to open the simulator manually once. Run `npx expo start` in the root dir, and then enter `I` to launch Expo Go. After the manual launch, you can run `pnpm dev` in the root directory.

   ```diff
   +  "dev": "expo start --ios",
   ```

2. Run `pnpm dev` at the project root folder.

#### Use Android Emulator

1. Install Android Studio tools [as shown on expo docs](https://docs.expo.dev/workflow/android-studio-emulator).

2. Change the `dev` script at `apps/expo/package.json` to open the Android emulator.

   ```diff
   +  "dev": "expo start --android",
   ```

3. Run `pnpm dev` at the project root folder.

> **TIP:** It might be easier to run each app in separate terminal windows so you get the logs from each app separately. This is also required if you want your terminals to be interactive, e.g. to access the Expo QR code. You can run `pnpm --filter expo dev` and `pnpm --filter nextjs dev` to run each app in a separate terminal window.

### 3. When it's time to add a new package

To add a new package, simply run `pnpm turbo gen init` in the monorepo root. This will prompt you for a package name as well as if you want to install any dependencies to the new package (of course you can also do this yourself later).

The generator sets up the `package.json`, `tsconfig.json` and a `index.ts`, as well as configures all the necessary configurations for tooling around your package such as formatting, linting and typechecking. When the package is created, you're ready to go build out the package.

## References

The stack originates from [create-t3-app](https://github.com/t3-oss/create-t3-app).

A [blog post](https://jumr.dev/blog/t3-turbo) where I wrote how to migrate a T3 app into this.

## Questions?

<a href="https://cal.com/julius/quick-chat?utm_source=banner&utm_campaign=oss"><img alt="Book us with Cal.com" src="https://cal.com/book-with-cal-dark.svg" /></a>
