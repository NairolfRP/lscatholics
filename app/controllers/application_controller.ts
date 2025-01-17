import type { HttpContext } from "@adonisjs/core/http";
import { bind } from "@adonisjs/route-model-binding";
import Application from "#models/application";

export default class ApplicationController {
    async showAll({ inertia }: HttpContext) {
        return inertia.render("Applications");
    }

    @bind()
    async show({ inertia }: HttpContext, application: Application) {
        // TODO
        return inertia.render("SingleApplication", {
            application,
            applicant: application.user_id,
        });
    }
}
