import env from "#start/env";
import { defineConfig, services } from "@adonisjs/ally";
import { GTAWorldDriverService } from "#services/gtaw_service";

const allyConfig = defineConfig({
    discord: services.discord({
        clientId: env.get("DISCORD_CLIENT_ID"),
        clientSecret: env.get("DISCORD_CLIENT_SECRET"),
        callbackUrl: `${env.get("APP_URL")}/api/auth/discord/callback`,
        scopes: ["identify", "guilds"],
    }),
    gtaw: GTAWorldDriverService({
        clientId: env.get("GTAW_OAUTH_CLIENT_ID"),
        clientSecret: env.get("GTAW_OAUTH_CLIENT_SECRET"),
        callbackUrl: `${env.get("APP_URL")}/api/auth/gtaw/callback`,
    }),
});

export default allyConfig;

declare module "@adonisjs/ally/types" {
    interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
