/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from "@adonisjs/core/env";

export default await Env.create(new URL("../", import.meta.url), {
    NODE_ENV: Env.schema.enum(["development", "production", "test"] as const),
    PORT: Env.schema.number(),
    APP_KEY: Env.schema.string(),
    HOST: Env.schema.string({ format: "host" }),
    LOG_LEVEL: Env.schema.string(),

    APP_NAME: Env.schema.string(),
    APP_URL: Env.schema.string(),

    /*
    |----------------------------------------------------------
    | Variables for configuring i18n package
    |----------------------------------------------------------
    */
    DEFAULT_LOCALE: Env.schema.string(),
    FALLBACK_LOCALE: Env.schema.string.optional(),

    /*
    |----------------------------------------------------------
    | Variables for configuring session package
    |----------------------------------------------------------
    */
    SESSION_DRIVER: Env.schema.enum(["cookie", "memory"] as const),

    /*
    |----------------------------------------------------------
    | Variables for Discord
    |----------------------------------------------------------
    */
    DISCORD_CLIENT_ID: Env.schema.string(),
    DISCORD_CLIENT_SECRET: Env.schema.string(),
    DISCORD_BOT_TOKEN: Env.schema.string(),

    DISCORD_CONTACT_WEBHOOK: Env.schema.string(),
    DISCORD_CONTACT_WEBHOOK_TAG_ID: Env.schema.string(),

    DONATE_DISCORD_WEBHOOK: Env.schema.string(),
    DONATE_PUBLIC_DISCORD_WEBHOOK: Env.schema.string(),

    /*
    |----------------------------------------------------------
    | Variables for Facebrowser
    |----------------------------------------------------------
    */
    FACEBROWSER_BASE_URL: Env.schema.string(),
    FACEBROWSER_CLIENT_ID: Env.schema.string(),
    FACEBROWSER_CLIENT_SECRET: Env.schema.string(),

    /*
    |----------------------------------------------------------
    | Variables for Fleeca API
    |----------------------------------------------------------
    */
    FLEECA_AUTH_KEY: Env.schema.string(),
});
