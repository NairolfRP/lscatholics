import { configApp } from "@adonisjs/eslint-config";
import eslintConfigPrettier from "eslint-config-prettier";

export default configApp({
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
