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
        setTimeout: "readonly",
        localStorage: "readonly",
        parseInt: "readonly",
        Image: "readonly",
        console: "readonly",
        AudioContext: "readonly",
        webkitAudioContext: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "semi": ["error", "always"],
      "quotes": ["error", "single", { "avoidEscape": true }],
      "eqeqeq": ["error", "always"],
      "prefer-const": "error",
      "no-var": "error",
      "curly": "error",
      "no-console": ["warn", { "allow": ["warn", "error"] }]
    }
  }
];
