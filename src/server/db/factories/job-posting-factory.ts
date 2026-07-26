import { Factory } from '#server/db/factories/factory'
import { jobPostings } from '#server/db/schema/job-posting-schema.ts'
import { DEPARTMENT_VALUES } from '#shared/constants/department.ts'
import { EMPLOYMENT_TYPE_VALUES } from '#shared/constants/employment.ts'

export const jobPostingFactory = Factory.define(jobPostings, ({ faker }) => {
  const title = faker.person.jobTitle()

  const isActive = faker.datatype.boolean({ probability: 0.85 })
  const hasSalaryRange = faker.datatype.boolean({ probability: 0.7 })
  const salaryMin = faker.number.int({ min: 35000, max: 90000 })
  const salaryMax = hasSalaryRange ? salaryMin + faker.number.int({ min: 10000, max: 50000 }) : null

  return {
    title,
    slug: `${faker.helpers.slugify(title).toLowerCase()}-${crypto.randomUUID().slice(0, 6)}`,
    description: faker.lorem.paragraphs({ min: 2, max: 4 }, '\n\n').slice(0, 2000),
    reportsTo: faker.person.jobTitle(),
    department: faker.helpers.arrayElement(DEPARTMENT_VALUES),
    responsibilities: faker.helpers.multiple(() => faker.lorem.sentence(), {
      count: { min: 3, max: 6 },
    }),
    requirements: faker.helpers.multiple(() => faker.lorem.sentence(), {
      count: { min: 3, max: 6 },
    }),
    skills: faker.helpers.multiple(() => faker.lorem.sentence(), {
      count: { min: 3, max: 8 },
    }),
    salaryMin,
    salaryMax,
    employmentType: faker.helpers.arrayElement(EMPLOYMENT_TYPE_VALUES),
    isActive,
    postedAt: isActive ? faker.date.recent() : null,
    expiresAt: faker.date.future({ years: 1 }),
    authorId: null,
  }
})
