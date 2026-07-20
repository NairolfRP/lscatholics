import { PARISH_VALUES } from '#/shared/constants/parish'
import { churchEvents } from '../schema/church-event-schema'
import { Factory } from './factory'

const EVENT_TYPES = [
  'Messe',
  'Vêpres',
  'Réunion',
  'Retraite',
  'Catéchisme',
  'Veillée',
  'Concert',
  'Pèlerinage',
  'Atelier',
  'Baptême',
  'Confirmation',
  'Assemblée',
]
const EVENT_QUALIFIERS = [
  'dominicale',
  'de la Toussaint',
  'paroissiale',
  'spirituelle',
  'des adultes',
  'de prière',
  'de musique sacrée',
  'diocésain',
  'de lectio divina',
  'collectif',
  'des jeunes',
  'générale',
]

export const churchEventFactory = Factory.define(churchEvents, ({ faker }) => {
  const title = `${faker.helpers.arrayElement(EVENT_TYPES)} ${faker.helpers.arrayElement(EVENT_QUALIFIERS)}`
  const startDate = faker.date.soon({ days: 90 })
  const hasEndDate = faker.datatype.boolean({ probability: 0.6 })
  const registrationRequired = faker.datatype.boolean({ probability: 0.4 })

  return {
    title,
    slug: faker.helpers.slugify(`${title}-${faker.string.nanoid(6)}`).toLowerCase(),
    description: faker.lorem.sentences({ min: 1, max: 2 }),
    content: faker.lorem.paragraphs({ min: 2, max: 5 }, '\n\n'),
    location: faker.location.streetAddress({ useFullAddress: true }),
    parishId: faker.helpers.maybe(() => faker.helpers.arrayElement(PARISH_VALUES), {
      probability: 0.7,
    }),
    coverImageUrl: faker.image.url(),
    flyerUrl: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.3 }),
    registrationRequired,
    maxParticipants: registrationRequired ? faker.number.int({ min: 10, max: 200 }) : null,
    startDate,
    endDate: hasEndDate ? faker.date.soon({ days: 3, refDate: startDate }) : null,
    authorId: null,
  }
})
