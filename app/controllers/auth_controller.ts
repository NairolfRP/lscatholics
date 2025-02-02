import type { HttpContext } from "@adonisjs/core/http";
import User from "#models/user";
import UserConnection from "#models/user_connection";

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

            if (await auth.check()) {
                const loggedUser = auth.user;

                if (!loggedUser) {
                    await auth.use("web").logout();
                    session.forget("user_social_info");
                    return response.badRequest("User authenticated, but user is undefined");
                }

                const existingProvider = await UserConnection.query()
                    .where("provider", provider)
                    .where("provider_id", socialUser.id)
                    .first();

                if (existingProvider && existingProvider.userID !== loggedUser.id) {
                    return response.badRequest(
                        `This ${provider} account is already linked to another user.`,
                    );
                }

                if (!existingProvider) {
                    await UserConnection.create({
                        userID: loggedUser.id,
                        provider,
                        providerID: socialUser.id,
                        username: socialUser.nickName || socialUser.name,
                        isMain: false,
                    });

                    session.flash("notification", {
                        variant: "success",
                        message: `${provider} account successfully linked!`,
                    });
                }

                const currentUserSocialInfoSession = session.get("user_social_info");
                session.put("user_social_info", {
                    ...currentUserSocialInfoSession,
                    tokens: {
                        ...currentUserSocialInfoSession.tokens,
                        [provider]: {
                            token: socialUser.token.token,
                            expiresIn: socialUser.token.expiresIn,
                            expiresAt: socialUser.token.expiresAt,
                        },
                    },
                });

                return this.closeWindow();
            }

            const existingProvider = await UserConnection.query()
                .where("provider", provider)
                .where("provider_id", socialUser.id)
                .preload("user")
                .first();

            let user: User;

            if (existingProvider) {
                user = existingProvider.user;
            } else {
                user = await User.create({});

                await UserConnection.create({
                    userID: user.id,
                    provider,
                    providerID: socialUser.id,
                    username: socialUser.nickName || socialUser.name,
                    isMain: true,
                });
            }

            await auth.use("web").login(user);

            session.put("user_social_info", {
                mainProvider: {
                    provider,
                    id: socialUser.id,
                    nickname: socialUser.nickName,
                    name: socialUser.name,
                    avatarURL: socialUser.avatarUrl,
                },
                tokens: {
                    [provider]: {
                        token: socialUser.token.token,
                        expiresIn: socialUser.token.expiresIn,
                        expiresAt: socialUser.token.expiresAt,
                    },
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

    async unlink({ auth, request, response }: HttpContext) {
        const provider = request.param("provider");

        try {
            const userProvider = await UserConnection.query()
                .where("user_id", auth!.user!.id)
                .where("provider", provider)
                .first();

            if (!userProvider) {
                return response.notFound(`404 - Invalid provider or not linked to this user`);
            }

            if (userProvider.isMain) {
                return response.unauthorized("Cannot delete user's main provider");
            }

            const linkedProvidersCount = await auth!
                .user!.related("connections")
                .query()
                .count("* as total");

            const totalLinkedProviders = linkedProvidersCount[0].$extras.total;

            if (totalLinkedProviders === "1") {
                return response.unauthorized("Cannot delete user's last provider.");
            }

            await userProvider.delete();

            return response.redirect().back();
        } catch (e) {
            return response.internalServerError("An error has occurred");
        }
    }

    async setAsMain({ auth, request, response }: HttpContext) {
        const provider = request.param("provider");

        try {
            const userProvider = await UserConnection.query()
                .where("user_id", auth!.user!.id)
                .where("provider", provider)
                .first();

            if (!userProvider) {
                return response.notFound(`404 - Invalid provider or not linked to this user`);
            }

            if (userProvider.isMain) {
                return response.badRequest("Already main");
            }

            const updateOtherProviders = auth!
                .user!.related("connections")
                .query()
                .where("is_main", true)
                .update({ is_main: false });

            userProvider.isMain = true;

            await Promise.all([updateOtherProviders, userProvider.save()]);

            return response.redirect().back();
        } catch (e) {
            return response.internalServerError("An error has occurred");
        }
    }
}
