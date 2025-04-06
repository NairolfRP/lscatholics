import User from "#models/user";
import { BasePolicy } from "@adonisjs/bouncer";
import { DiscordAuthService } from "#services/discord/discord_auth_service";
import { inject } from "@adonisjs/core";
import { AuthorizerResponse } from "@adonisjs/bouncer/types";

@inject()
export default class DiscordPolicy extends BasePolicy {
    constructor(protected discordService: DiscordAuthService) {
        super();
    }

    public async hasRole(user: User, role: string): Promise<AuthorizerResponse> {
        const userRoles = await this.discordService.getUserConnectionAndRoles(user);
        return userRoles.includes(role);
    }

    public async hasAnyRole(user: User, roles: string[]): Promise<AuthorizerResponse> {
        const userRoles = await this.discordService.getUserConnectionAndRoles(user);
        return roles.some((role) => userRoles.includes(role));
    }

    public async hasAllRoles(user: User, roles: string[]): Promise<AuthorizerResponse> {
        const userRoles = await this.discordService.getUserConnectionAndRoles(user);
        return roles.every((role) => userRoles.includes(role));
    }
}
