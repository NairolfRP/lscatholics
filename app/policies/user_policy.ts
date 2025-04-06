//import User from "#models/user";
import { BasePolicy } from "@adonisjs/bouncer";
//import { AuthorizerResponse } from "@adonisjs/bouncer/types";
//import { DiscordAuthService } from "#services/discord/discord_auth_service";

export default class UserPolicy extends BasePolicy {
    // TODO
    /*accessDashboard(user: User): AuthorizerResponse {
        const discord = new DiscordAuthService();
        const roles = discord.getUserRoles(user);
    }*/
}
