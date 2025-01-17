import type { HttpContext } from "@adonisjs/core/http";

import Event from "#models/event";

export default class WelcomeController {
    public async show({ inertia }: HttpContext) {
        const eventsQuery = await Event.query().where("datetime", ">=", Date.now()).orderBy("datetime").limit(3);

        const events = eventsQuery.map((e) => e.mapSummaryToDisplay());

        return inertia.render('Welcome', { events })
    }
}
