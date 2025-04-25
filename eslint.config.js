import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tseslint.config(
  {
    ignores: [".next"],
  },
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
      rules: {
        "padded-blocks": "off",
        "no-unused-vars": "off",
        "no-undef": "off",
        "no-redeclare": "off",
        "no-duplicate-imports": "off",
        "no-useless-concat": "off",
        "no-useless-escape": "off",
        "no-useless-catch": "off",
        "no-useless-return": "off",
        "no-useless-rename": "off",
        "no-useless-computed-key": "off",
        "no-useless-boolean-flag": "off",
        "no-useless-else-return": "off",
        "no-useless-call": "off",
        "no-useless-constructor": "off",
      },
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
);
