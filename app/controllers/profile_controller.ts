import type { HttpContext } from "@adonisjs/core/http";
import { z } from "zod";

export default class ProfileController {
    async show({ inertia }: HttpContext) {
        return inertia.render("Profile/Edit");
    }

    async update({}: HttpContext) {}

    async destroy({ response, request, session, auth }: HttpContext) {
        const validationSchema = z.object({
            username: z.literal(auth.user!.name, {
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
