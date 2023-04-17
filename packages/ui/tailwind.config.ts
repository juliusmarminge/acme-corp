import type { Config } from "tailwindcss";

import baseConfig from "@acme/tailwind-config";

export default {
  presets: [baseConfig],
  content: ["./src/**/*.tsx"],
} satisfies Config;
