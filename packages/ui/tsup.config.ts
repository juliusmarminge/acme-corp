import { readFile, writeFile } from "fs/promises";
import { defineConfig, type Options } from "tsup";

const entry = [
  "./src/avatar.tsx",
  "./src/button.tsx",
  "./src/calendar.tsx",
  "./src/card.tsx",
  "./src/command.tsx",
  "./src/dialog.tsx",
  "./src/dropdown-menu.tsx",
  "./src/icons.tsx",
  "./src/input.tsx",
  "./src/label.tsx",
  "./src/popover.tsx",
  "./src/select.tsx",
  "./src/tabs.tsx",
  "./src/toast.tsx",
  "./src/toaster.tsx",
  "./src/use-toast.tsx",
];

export default defineConfig((opts) => {
  const common = {
    clean: !opts.watch,
    dts: true,
    format: ["esm"],
    minify: true,
    outDir: "dist",
  } satisfies Options;

  return [
    {
      // separate not to inject the banner
      ...common,
      entry: ["./src/index.ts"],
    },
    {
      ...common,
      entry,
      esbuildOptions: (opts) => {
        opts.banner = {
          js: '"use client";',
        };
      },
      async onSuccess() {
        const pkgJson = JSON.parse(
          await readFile("./package.json", {
            encoding: "utf-8",
          }),
        ) as PackageJson;
        pkgJson.exports = {
          "./package.json": "./package.json",
          "./styles.css": "./dist/index.css",
          ".": {
            import: "./dist/index.mjs",
            types: "./dist/index.d.ts",
          },
        };
        entry
          .filter((e) => e.endsWith(".tsx"))
          .forEach((entry) => {
            const file = entry.replace("./src/", "").replace(".tsx", "");
            pkgJson.exports["./" + file] = {
              import: "./dist/" + file + ".mjs",
              types: "./dist/" + file + ".d.ts",
            };
          });

        await writeFile("./package.json", JSON.stringify(pkgJson, null, 2));
      },
    },
  ];
});

type PackageJson = {
  name: string;
  exports: Record<string, { import: string; types: string } | string>;
  files: string[];
  dependencies: Record<string, string>;
  pnpm: {
    overrides: Record<string, string>;
  };
};
