import type { HttpContext } from "@adonisjs/core/http";

export default class DashboardController {
    show({ inertia }: HttpContext) {
        return inertia.render("Dashboard/Dashboard");
    }
}
