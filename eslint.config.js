export default [
  {
    ignores: ["dist/**", "node_modules/**"]
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        Math: "readonly",
        requestAnimationFrame: "readonly",
        setTimeout: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "semi": ["error", "always"],
      "quotes": ["error", "single", { "avoidEscape": true }]
    }
  }
];
