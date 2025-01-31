import type { HttpContext } from "@adonisjs/core/http";

import Event from "#models/event";
import { formatTimestamp } from "../helpers/date_time.js";

export default class WelcomeController {
    public async show({ inertia }: HttpContext) {
        const currentTimestamp = formatTimestamp(Date.now());

        const eventsQuery = await Event.query()
            .where("datetime", ">=", currentTimestamp)
            .orderBy("datetime")
            .limit(3);

        const events = eventsQuery.map((e) => e.mapSummaryToDisplay());

        return inertia.render("Welcome", { events });
    }
}
