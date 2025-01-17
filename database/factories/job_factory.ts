import factory from "@adonisjs/lucid/factories";
import Job from "#models/job";
import { DateTime } from "luxon";

export const JobFactory = factory
    .define(Job, async ({ faker }) => {
        return {
            title: faker.person.jobTitle(),
            description: faker.person.jobDescriptor(),
            organization: faker.company.name(),
            location: faker.person.jobArea(),
            requirements: faker.person.jobDescriptor(),
            wage: faker.number.float().toString(),
            category: faker.number.int({ min: 0, max: 3 }),
            expiration: DateTime.fromJSDate(faker.date.future()),
            is_open: 1 as unknown as boolean,
        };
    })
    .build();
