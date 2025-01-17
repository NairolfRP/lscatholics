import type { DiscordWebhook } from "../../interfaces/DiscordWebhook.d.ts";
import { DiscordEmbedService } from "#services/discord/discord_embed_service";

export class DiscordWebhookService {
  private readonly webhookURL: string ;
  private readonly username?: string | null = null;
  private readonly avatarURL?: string | null = null;
  private readonly content?: string | null = null;
  private readonly threadName?: string | null = null;
  private readonly tags: string[] = [];
  private readonly embeds: DiscordEmbedService[] = [];

  private constructor(options: DiscordWebhook) {
      this.webhookURL = options.webhookURL;
      this.username = options.username;
      this.avatarURL = options.avatarURL;
      this.content = options.content;
      this.threadName = options.threadName;
      this.tags = options.tags || [];
      this.embeds = options.embeds || [];
  }

  public static create(webhookURL: string, options: Omit<DiscordWebhook, "webhookURL">): DiscordWebhookService {
      const instance = new DiscordWebhookService({ ...options, webhookURL });

      return instance;
  }

  public async send(): Promise<boolean> {
      if(this.embeds.length === 0 && this.content?.length === 0) {
          throw new Error("DiscordWebhook need at least a content or one embed.");
      }

      try {
          const response = await fetch(this.webhookURL, {
              method: "POST",
              body: this.toJSON(),
              headers: {
                  "Content-Type": "application/json",
              }
          });

          return response.ok;
      } catch (e: any) {
          console.error(e);
          return false;
      }
  }

  private toJSON(): string {
      const payload = {
          username: this.username,
          avatar_url: this.avatarURL,
          content: this.content,
          thread_name: this.threadName,
          applied_tags: this.tags,
          embeds: this.embeds.map((embed) => embed.toObject())
      };

      const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v !== null && v !== undefined));

      return JSON.stringify(cleanPayload);
  }
}
