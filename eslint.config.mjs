import { FlatCompat } from "@eslint/eslintrc"
import { fileURLToPath } from "url"
import { dirname } from "path"
import reactPlugin from "eslint-plugin-react"
import reactHooksPlugin from "eslint-plugin-react-hooks"
import jsxA11yPlugin from "eslint-plugin-jsx-a11y"
import typescriptPlugin from "@typescript-eslint/eslint-plugin"
import importPlugin from "eslint-plugin-import"
import prettierPlugin from "eslint-plugin-prettier"
import tailwindcssPlugin from "eslint-plugin-tailwindcss"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  ...compat.extends(
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "next/core-web-vitals",
    "next/typescript",
    "prettier"
  ),
  {
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      "@typescript-eslint": typescriptPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
      tailwindcss: tailwindcssPlugin,
    },
    rules: {
      "prettier/prettier": ["off"], // Cho phép dấu nháy kép
      "react/react-in-jsx-scope": "off", // Không cần import React trong Next.js
      "jsx-a11y/anchor-is-valid": "off", // Bỏ qua lỗi liên quan đến thẻ <Link> của Next.js
      "@typescript-eslint/explicit-module-boundary-types": "off", // Không bắt buộc khai báo kiểu trả về
      "tailwindcss/no-custom-classname": "off", // Bỏ qua lỗi về custom class
      "no-unused-vars": "warn", // Cảnh báo nếu có biến không sử dụng
      "@typescript-eslint/no-unused-vars": "off", // Disable no-unused-vars for TypeScript
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",
      "import/no-anonymous-default-export": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
    ignores: ["node_modules", "dist", "build", ".next"],
  },
]
