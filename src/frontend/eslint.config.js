import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import prettierConfig from "eslint-config-prettier";

/**
 * ESLint flat-config for Vue 3 + TypeScript frontend.
 * Covers:  .ts  .tsx  .vue  files under src/frontend/
 */
export default tseslint.config(
  // ── Global ignores ─────────────────────────────────────────────────────
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      "*.min.js",
      "vite.config.ts", // linted separately if needed
    ],
  },

  // ── Base JS rules ───────────────────────────────────────────────────────
  js.configs.recommended,

  // ── TypeScript rules ────────────────────────────────────────────────────
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  // ── Vue 3 rules ─────────────────────────────────────────────────────────
  ...pluginVue.configs["flat/recommended"],

  // ── Project-specific overrides ──────────────────────────────────────────
  {
    files: ["**/*.vue", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        project: "./tsconfig.json",
        extraFileExtensions: [".vue"],
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
    rules: {
      // ── TypeScript ────────────────────────────────────────────────────
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // ── Vue 3 ─────────────────────────────────────────────────────────
      "vue/multi-word-component-names": "error",
      "vue/component-api-style": ["error", ["script-setup", "composition"]],
      "vue/define-macros-order": [
        "error",
        {
          order: ["defineOptions", "defineProps", "defineEmits", "defineSlots"],
        },
      ],
      "vue/block-order": [
        "error",
        { order: ["script", "template", "style"] },
      ],
      "vue/no-v-html": "warn",
      "vue/require-default-prop": "error",
      "vue/require-explicit-emits": "error",
      "vue/prefer-import-from-vue": "error",

      // ── General ────────────────────────────────────────────────────────
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      eqeqeq: ["error", "always"],
    },
  },

  // ── Disable formatting rules that conflict with Prettier ────────────────
  prettierConfig,
);
