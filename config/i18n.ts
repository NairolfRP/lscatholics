import app from "@adonisjs/core/services/app";
import { defineConfig, formatters, loaders } from "@adonisjs/i18n";
import env from "#start/env";

const i18nConfig = defineConfig({
    defaultLocale: env.get("DEFAULT_LOCALE"),
    fallbackLocales: {
        fr: "en",
        en: "fr",
    },
    fallback: env.get("FALLBACK_LOCALE") ? () => env.get("FALLBACK_LOCALE") as string : undefined,
    formatter: formatters.icu(),

    loaders: [
        /**
         * The fs loader will read translations from the
         * "resources/lang" directory.
         *
         * Each subdirectory represents a locale. For example:
         *   - "resources/lang/en"
         *   - "resources/lang/fr"
         *   - "resources/lang/it"
         */
        loaders.fs({
            location: app.languageFilesPath(),
        }),
    ],
});

export default i18nConfig;
