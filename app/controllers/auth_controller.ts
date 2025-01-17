import type { HttpContext } from "@adonisjs/core/http";
import User from "#models/user";

export default class AuthController {
    private closeWindow() {
        return "<script>window.close()</script>";
    }
    async redirect({ params, ally }: HttpContext) {
        try {
            const { provider } = params;

            if (provider === "facebrowser") {
                return ally.use(provider).stateless().redirect();
            }

            return ally.use(provider).redirect();
        } catch (e) {
            console.error("Redirect error", e);

            return this.closeWindow();
        }
    }

    async callback({ session, response, params, auth, ally }: HttpContext) {
        try {
            const { provider } = params;

            const social = await ally.use(provider);

            if (provider === "facebrowser") social.stateless();

            if (social.accessDenied()) return response.unauthorized("Access denied");

            if (social.stateMisMatch()) return response.badRequest("State mismatch");

            if (social.hasError()) return response.badRequest(social.getError());

            const socialUser = await social.user();

            if (!socialUser) return response.badRequest("Failure to get user information");

            const providerIDField = `${provider}_id` as keyof User;

            if (await auth.check()) {
                const loggedUser = auth.user;

                if (!loggedUser) {
                    await auth.use("web").logout();
                    session.forget("user_social_info");
                    return response.badRequest("User authenticated, but user is undefined");
                }

                if (loggedUser[providerIDField] === socialUser.id) {
                    return response.badRequest(
                        `This ${provider} account is already linked to this user`,
                    );
                }

                const isAlreadyLinkedToAnother = await User.query().where(
                    providerIDField,
                    socialUser.id,
                );

                if (isAlreadyLinkedToAnother) {
                    return response.badRequest(
                        `This ${provider} account is already linked to another user.`,
                    );
                }

                (loggedUser[providerIDField] as string) = socialUser.id;

                await loggedUser.save();

                session.flash("notification", {
                    variant: "success",
                    message: `${provider} account successfully linked!`,
                });

                return response.ok(
                    `${provider} successfully linked to the user ${loggedUser.name}`,
                );
            }

            const user = await User.firstOrCreate(
                {
                    [`${provider}_id`]: socialUser.id,
                },
                {
                    name: socialUser.nickName,
                    [`${provider}_id`]: socialUser.id,
                },
            );

            if (!user) return response.expectationFailed("Failed to find or create account");

            if (user.$isDirty) {
                await user.save();
            }

            await auth.use("web").login(user);

            session.put("user_social_info", {
                provider,
                id: socialUser.id,
                nickname: socialUser.nickName,
                name: socialUser.name,
                avatarURL: socialUser.avatarUrl,
                token: {
                    token: socialUser.token.token,
                    expiresIn: socialUser.token.expiresIn,
                    expiresAt: socialUser.token.expiresAt,
                },
            });

            session.flash("notification", {
                variant: "success",
                message: "Successful login!",
            });

            return this.closeWindow();
        } catch (e) {
            console.error("Callback error", e);

            response.redirect().toPath("/");

            return this.closeWindow();
        }
    }

    async logout({ session, auth, response }: HttpContext) {
        try {
            await auth.use("web").logout();

            session.forget("user_social_info");

            return response.redirect().back();
        } catch (e) {
            console.error("Failed to logout", e);
            session.flash("notification", {
                variant: "error",
                message: "An error has occurred. Please try again later.",
            });
            return response.redirect().back();
        }
    }
}
