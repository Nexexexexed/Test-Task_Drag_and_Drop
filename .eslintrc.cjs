module.exports = {
  env: { browser: true, es2023: true },
  extends: ["eslint:recommended"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  rules: { "no-unused-vars": ["warn"] },
};
