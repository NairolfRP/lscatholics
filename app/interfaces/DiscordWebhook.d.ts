import type { DiscordEmbedService } from "#services/discord/discord_embed_service";

export interface DiscordWebhook {
    webhookURL: string;
    username?: string;
    avatarURL?: string;
    content?: string;
    threadName?: string;
    tags?: string[] | [];
    embeds?: DiscordEmbedService[] | [];
}
