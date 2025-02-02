import type { HttpContext } from "@adonisjs/core/http";
import { z } from "zod";

export default class ProfileController {
    async show({ inertia, auth }: HttpContext) {
        const user = auth!.user!;

        const providers = await user
            .related("connections")
            .query()
            .select(["id", "provider", "username", "is_main"])
            .orderBy("is_main", "desc")
            .orderBy("created_at", "asc");

        return inertia.render("Profile/Edit", {
            providers: providers.map(
                (provider) =>
                    provider.toJSON() as {
                        id: number;
                        provider: string;
                        username: string;
                        isMain: boolean;
                        createdAt: string;
                    },
            ),
        });
    }

    async update({}: HttpContext) {}

    async destroy({ response, request, session, auth }: HttpContext) {
        const username = session.get("user_social_info").mainProvider.nickname as string;

        const validationSchema = z.object({
            username: z.literal(username, {
                message: "You literally need to type in your username.",
            }),
        });

        await request.validate(validationSchema);

        try {
            const user = auth.user!;

            await auth.use("web").logout();

            user.delete();

            session.flash("notification", {
                variant: "success",
                message: "Your account has been deleted",
            });

            return response.redirect("/");
        } catch (e) {
            throw e;
        }
    }
}
