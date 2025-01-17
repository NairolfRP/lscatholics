import env from "#start/env";
import { defineConfig, services } from "@adonisjs/ally";
import { FacebrowserService } from "#services/facebrowser_service";

const allyConfig = defineConfig({
    discord: services.discord({
        clientId: env.get("DISCORD_CLIENT_ID"),
        clientSecret: env.get("DISCORD_CLIENT_SECRET"),
        callbackUrl: `${env.get("APP_URL")}/api/auth/discord/callback`,
        scopes: ["identify", "guilds"],
    }),
    facebrowser: FacebrowserService({
        clientId: env.get("FACEBROWSER_CLIENT_ID"),
        clientSecret: env.get("FACEBROWSER_CLIENT_SECRET"),
        callbackUrl: `${env.get("APP_URL")}/api/auth/facebrowser/callback`,
    }),
});

export default allyConfig;

declare module "@adonisjs/ally/types" {
    interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
