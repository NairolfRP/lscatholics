import { DiscordAuthService } from "#services/discord/discord_auth_service";
import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";

export default class DashboardMiddleware {
    protected UNAUTHORIZED_MESSAGE = "You are not authorized.";

    protected ADMIN_ROLES = ["1050459383177420821", "1260645302105411675"];
    protected PERSONNEL_ROLE = "1253622145515393036";

    async handle(ctx: HttpContext, next: NextFn, requiredRoles: string[] = []) {
        const user = ctx.auth.user;

        if (!user) {
            return ctx.response.redirect().back();
        }

        await user.load("connections", (c) => {
            c.where("provider", "discord");
        });

        const userDiscord = user.connections[0];

        if (userDiscord && userDiscord.providerID) {
            const discord = new DiscordAuthService();

            const userDiscordRoles = await discord.getUserRoles(userDiscord.providerID);

            if (userDiscordRoles.error) {
                return ctx.response.unauthorized(userDiscordRoles.error);
            }

            const isPersonnelMember = userDiscordRoles.roles.includes(this.PERSONNEL_ROLE);

            const isAdmin = userDiscordRoles.roles.some((role) => this.ADMIN_ROLES.includes(role));

            const hasRequiredRoles = requiredRoles.every((role) =>
                userDiscordRoles.roles.includes(role),
            );

            if (!isAdmin && (!isPersonnelMember || !hasRequiredRoles)) {
                return ctx.response.unauthorized(this.UNAUTHORIZED_MESSAGE);
            }

            return await next();
        }

        return ctx.response.unauthorized(this.UNAUTHORIZED_MESSAGE);
    }
}
