import { configApp } from "@adonisjs/eslint-config";
import eslintConfigPrettier from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default configApp({
    ...reactPlugin.configs.flat.recommended,
    ...reactPlugin.configs.flat["jsx-runtime"],
    ...reactHooksPlugin.configs["recommended-latest"],
    rules: {
        "prettier/prettier": ["error", { endOfLine: "auto" }, { usePrettierrc: true }],
        "no-restricted-imports": [
            "error",
            {
                patterns: "@mui/*/*/*",
            },
        ],
    },
    ...eslintConfigPrettier,
});
