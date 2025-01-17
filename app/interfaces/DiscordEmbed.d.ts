export type DiscordEmbedFields = {
    name: string;
    value: string;
    inline?: boolean;
}

export type DiscordEmbedFooter = { text: string; iconURL?: string; };

export type DiscordEmbedAuthor = { name: string, url?: string; iconURL: string; };

export interface DiscordEmbed {
    readonly title: string;
    readonly description?: string | null;
    readonly url?: string | null;
    readonly color?: number | null;
    readonly timestamp?: string | null;

    readonly footer?: DiscordEmbedFooter | null;
    readonly image?: string | null;
    readonly thumbnail?: string | null;
    readonly author?: DiscordEmbedAuthor | null;

    fields?: DiscordEmbedFields[] | []
}
