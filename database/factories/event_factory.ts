import factory from "@adonisjs/lucid/factories";
import Event from "#models/event";
import { DateTime } from "luxon";

export const EventFactory = factory
    .define(Event, async ({ faker }) => {
        return {
            title: faker.lorem.words({ min: 5, max: 30 }),
            description: faker.lorem.paragraphs({ min: 5, max: 10 }),
            image: faker.image.urlPicsumPhotos({ width: 1280, height: 720 }),
            datetime: DateTime.fromJSDate(faker.date.future()),
        };
    })
    .build();
