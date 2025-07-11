import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import security from "eslint-plugin-security";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ["tests-examples/**/*"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  security.configs.recommended,
];

export default eslintConfig;
