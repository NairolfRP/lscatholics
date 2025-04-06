import env from "#start/env";
import User from "#models/user";

/*interface DiscordRole {
    id: string;
    name: string;
    color: number;
    hoist: boolean;
    icon?: string;
    unicode_emoji?: string;
    position: number;
    managed: boolean;
    mentionable: boolean;
    tags?: Record<string, string | null>;
    flags: number;
}*/

interface DiscordGuildMemberObject {
    roles: string[];
}

export class DiscordAuthService {
    private botToken = env.get("DISCORD_BOT_TOKEN");
    private guildID = env.get("DISCORD_GUILD_ID");

    private async getUserDiscordConnection(user: User) {
        await user.load("connections", (c) => {
            c.where("provider", "discord");
        });

        const discordConnection = user.connections.find((c) => c.provider === "discord");

        if (!discordConnection) {
            throw new Error("This user has no linked discord account");
        }

        return discordConnection;
    }

    async getUserConnectionAndRoles(user: User) {
        const discord = await this.getUserDiscordConnection(user);
        const { roles } = await this.getUserRoles(discord.providerID);
        return roles;
    }

    async getUserRoles(
        userID: string,
    ): Promise<{ error: string | null; roles: DiscordGuildMemberObject["roles"] }> {
        try {
            const response = await fetch(
                `https://discord.com/api/v10/guilds/${this.guildID}/members/${userID}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bot ${this.botToken}`,
                    },
                },
            );

            const data = await response.json();

            if (!response.ok) {
                const discordError = data as { message: string; code: number };
                if (discordError.code === 10007) {
                    console.warn(`Discord user ${userID} is not a member of guild ${this.guildID}`);
                    return { error: "NOT_MEMBER", roles: [] };
                }

                if (discordError.code === 10013) {
                    console.warn(`Discord user ${userID} does not exist`);
                    return { error: "INVALID_USER", roles: [] };
                }

                console.error(data);
                return { error: "API_ERROR", roles: [] };
            }

            return { error: null, roles: (data as DiscordGuildMemberObject).roles || [] };
        } catch (e) {
            console.error("Failed to get user roles from Discord:", e);
            return { error: "NETWORK_ERROR", roles: [] };
        }
    }

    async hasRole(user: User, role: string) {
        const userRoles = await this.getUserConnectionAndRoles(user);
        return userRoles.includes(role);
    }

    public async hasAnyRole(user: User, roles: string[]) {
        const userRoles = await this.getUserConnectionAndRoles(user);
        return roles.some((role) => userRoles.includes(role));
    }

    async hasAllRoles(user: User, roles: string[]) {
        const userRoles = await this.getUserConnectionAndRoles(user);
        return roles.every((role) => userRoles.includes(role));
    }
}
