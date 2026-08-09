import { bench, describe } from 'vitest'
import {
  createChurchEventSchema,
  editChurchEventSchema,
} from '#/features/church-event/schemas/church-event.schema'
import { editJobPostingSchema } from '#/features/job-posting/schemas/job-posting.schema'
import { createPostSchema, postsSearchSchema } from '#/features/post/schemas/post.schema'
import { getFieldErrors } from '#/utils/form'
import { DEPARTMENT } from '#shared/constants/department.ts'
import { EMPLOYMENT_TYPE } from '#shared/constants/employment.ts'
import { PARISH } from '#shared/constants/parish.ts'
import { POST_STATUS } from '#shared/constants/post-status.ts'
import { dashboardFiltersSchema } from '#shared/schemas/dashboard/search.schema'

const validPost = {
  title: 'Bénédiction de la nouvelle église Saint-Michel',
  slug: 'benediction-de-la-nouvelle-eglise-saint-michel',
  excerpt: "Retour sur la bénédiction de l'église Saint-Michel à Los Santos.",
  content:
    "L'archevêque a présidé la cérémonie de bénédiction en présence des fidèles de la paroisse.".repeat(
      4
    ),
  coverImageUrl: 'https://example.com/assets/images/saint-michel.webp',
  status: POST_STATUS.PUBLISHED,
  publishedAt: new Date('2025-03-19T14:32:00Z'),
}

const invalidPost = {
  title: 'no',
  slug: 'Invalid--Slug-',
  excerpt: 'x'.repeat(200),
  content: 'trop court',
  coverImageUrl: 'not-an-url',
  status: 'unknown',
  publishedAt: null,
}

const validChurchEvent = {
  title: 'Messe dominicale à la Cathédrale',
  slug: 'messe-dominicale-a-la-cathedrale',
  description: 'Messe dominicale célébrée par le curé de la cathédrale.',
  content: 'Rejoignez-nous pour un moment de recueillement et de partage fraternel.'.repeat(3),
  location: 'Cathédrale de Los Santos',
  parish: PARISH.CATHEDRAL,
  coverImageUrl: 'https://example.com/assets/images/cathedrale.webp',
  flyerUrl: '',
  registrationRequired: true,
  maxParticipants: 250,
  startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
}

const validJobPosting = {
  title: 'Secrétaire du Chancelier',
  slug: 'secretaire-du-chancelier',
  description: 'Assiste le chancelier dans la gestion quotidienne de la curie diocésaine.'.repeat(
    2
  ),
  reportsTo: 'Chancelier',
  department: DEPARTMENT.CHANCELLOR,
  responsibilities: ['Gérer le courrier', 'Préparer les réunions', 'Archiver les actes'],
  requirements: ['Expérience administrative'],
  skills: ['Organisation', 'Rédaction'],
  salary: { min: 1200, max: 2400 },
  employmentType: EMPLOYMENT_TYPE.FULL_TIME,
  isActive: true,
  postedAt: new Date('2025-03-19T14:32:00Z'),
  expiresAt: '',
}

const postError = createPostSchema.safeParse(invalidPost).error!

describe('post schemas', () => {
  bench('createPostSchema valid input', () => {
    createPostSchema.safeParse(validPost)
  })

  bench('createPostSchema invalid input', () => {
    createPostSchema.safeParse(invalidPost)
  })

  bench('postsSearchSchema search params', () => {
    postsSearchSchema.parse({ page: '3', search: 'saint-michel' })
  })
})

describe('church event schemas', () => {
  bench('editChurchEventSchema valid input', () => {
    editChurchEventSchema.safeParse(validChurchEvent)
  })

  bench('createChurchEventSchema valid input', () => {
    createChurchEventSchema.safeParse(validChurchEvent)
  })
})

describe('job posting schemas', () => {
  bench('editJobPostingSchema valid input', () => {
    editJobPostingSchema.safeParse(validJobPosting)
  })
})

describe('dashboard filters schema', () => {
  bench('parse defaults', () => {
    dashboardFiltersSchema.parse({})
  })

  bench('parse full filters', () => {
    dashboardFiltersSchema.parse({ search: 'callahan', page: 4, sortBy: 'createdAt.desc' })
  })
})

describe('getFieldErrors', () => {
  bench('map zod issues to field errors', () => {
    getFieldErrors(postError)
  })
})
