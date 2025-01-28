import type {
    DiscordEmbed,
    DiscordEmbedAuthor,
    DiscordEmbedFields,
    DiscordEmbedFooter,
    DiscordEmbedImage,
} from "../../interfaces/discord_embed.d.ts";

export class DiscordEmbedService implements DiscordEmbed {
    readonly title: string;
    readonly description: string | null;
    readonly url: string | null;
    readonly color: number | null;
    readonly timestamp: string | null;
    readonly footer: DiscordEmbedFooter | null;
    readonly image: DiscordEmbedImage | null;
    readonly thumbnail: DiscordEmbedImage | null;
    readonly author: DiscordEmbedAuthor | null;
    readonly fields: DiscordEmbedFields[] = [];

    private constructor({
        title,
        description = null,
        url = null,
        color = null,
        timestamp = null,
        footer = null,
        image = null,
        thumbnail = null,
        author = null,
    }: Omit<DiscordEmbed, "fields">) {
        this.title = title;
        this.description = description;
        this.url = url;
        this.color = color;
        this.timestamp = timestamp;
        this.footer = footer;
        this.image = image;
        this.thumbnail = thumbnail;
        this.author = author;
    }

    public static create(options: Omit<DiscordEmbed, "fields">): DiscordEmbedService {
        return new DiscordEmbedService(options);
    }

    public addField({ name, value, inline = false }: DiscordEmbedFields) {
        this.fields.push({ name, value, inline });
        return this;
    }

    public toObject() {
        const payload = {
            title: this.title,
            description: this.description,
            url: this.url,
            color: this.color,
            timestamp: this.timestamp,
            footer: this.footer,
            image: this.image,
            thumbnail: this.thumbnail,
            author: this.author,
            fields: this.fields,
        };

        return Object.fromEntries(
            Object.entries(payload).filter(
                ([_, v]) => v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0),
            ),
        );
    }
}
