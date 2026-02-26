import factory from '@adonisjs/lucid/factories'
import Event from '#models/event'
import { DateTime } from 'luxon'

export const EventFactory = factory
  .define(Event, async ({ faker }) => {
    const title = faker.lorem.words({ min: 2, max: 6 })
    const slug = faker.helpers.slugify(title).toLowerCase()
    const startDate = faker.date.future({ years: 1 })
    const endDate = faker.datatype.boolean(0.7)
      ? faker.date.soon({ days: 7, refDate: startDate })
      : null

    return {
      title,
      slug,
      description: faker.lorem.sentence({ min: 10, max: 20 }),
      content: faker.lorem.paragraphs({ min: 3, max: 6 }, '\n\n'),
      location: `${faker.location.streetAddress()}, ${faker.location.city()}`,
      parishId: faker.datatype.boolean(0.6) ? faker.number.int({ min: 1, max: 50 }) : null,
      coverImageUrl: faker.datatype.boolean(0.8)
        ? faker.image.urlPicsumPhotos({ width: 800, height: 400 })
        : null,
      flyerUrl: faker.datatype.boolean(0.5)
        ? faker.image.urlPicsumPhotos({ width: 600, height: 800 })
        : null,
      registrationRequired: faker.datatype.boolean(0.4),
      maxParticipants: faker.datatype.boolean(0.6) ? faker.number.int({ min: 10, max: 500 }) : null,
      startDate: DateTime.fromJSDate(startDate),
      endDate: endDate ? DateTime.fromJSDate(endDate) : null,
    }
  })
  .state('with_registration', (event, { faker }) =>
    event.merge({
      registrationRequired: true,
      maxParticipants: faker.number.int({ min: 20, max: 200 }),
    })
  )
  .state('no_registration', (event) =>
    event.merge({
      registrationRequired: false,
      maxParticipants: null,
    })
  )
  .state('with_parish', (event, { faker }) =>
    event.merge({
      parishId: faker.number.int({ min: 1, max: 50 }),
    })
  )
  .state('upcoming', (event, { faker }) => {
    const startDate = faker.date.soon({ days: 30 })
    const endDate = faker.datatype.boolean(0.7)
      ? faker.date.soon({ days: 2, refDate: startDate })
      : null

    return event.merge({
      startDate: DateTime.fromJSDate(startDate),
      endDate: endDate ? DateTime.fromJSDate(endDate) : null,
    })
  })
  .state('past', (event, { faker }) => {
    const startDate = faker.date.past({ years: 1 })
    const endDate = faker.datatype.boolean(0.7)
      ? faker.date.soon({ days: 2, refDate: startDate })
      : null

    return event.merge({
      startDate: DateTime.fromJSDate(startDate),
      endDate: endDate ? DateTime.fromJSDate(endDate) : null,
    })
  })
  .build()
