/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: ["@acme/eslint-config/base", "@acme/eslint-config/react"],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    // TODO: Enable later when this app is implemented properly
    "@typescript-eslint/no-unused-vars": "off",
  },
};

module.exports = config;
