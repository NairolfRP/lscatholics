import type { HttpContext } from "@adonisjs/core/http";
import Event from "#models/event";
import { Str } from "../../shared/helpers/str.js";
import { bind } from "@adonisjs/route-model-binding";

export default class EventController {
    @bind()
    async show(
        { response, inertia }: HttpContext,
        year: number,
        month: number,
        event: Event,
        slug: string,
    ) {
        const validSlug = Str.slug(event.title);

        if (event.datetime.year !== year || event.datetime.month !== month || validSlug !== slug) {
            return response.redirect(
                `/event/${event.datetime.year}/${event.datetime.month}/${event.id}/${validSlug}`,
            );
        }

        return inertia.render("SingleEvent", { event });
    }

    async showAll({ request, inertia }: HttpContext) {
        const page = request.input("page", 1);

        const events = await Event.query()
            .orderBy("datetime")
            .select("id", "title", "description", "image", "datetime")
            .paginate(page, 5);

        const { currentPage, perPage, total, lastPage } = events;

        const formattedEvents = {
            currentPage,
            perPage,
            total,
            lastPage,
            items: events.toJSON().data.map((e) => e.mapSummaryToDisplay()),
        };

        return inertia.render("Find/Events", { events: formattedEvents });
    }
}
