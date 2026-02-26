import factory from '@adonisjs/lucid/factories'
import Job from '#models/job'
import { DateTime } from 'luxon'

const EMPLOYMENT_TYPES = ['full_time', 'part_time', 'temporary', 'occasional', 'contract']

const DEPARTMENTS = [
  'archbishop-office',
  'moderator-of-the-curia',
  'chancellor',
  'safety',
  'communications',
  'general-services',
  'human-resources',
  'financial-services',
  'general-counsel',
  'catholic-charities',
]

const RESPONSIBILITIES_POOL = [
  'Gérer et mentorer une équipe de développeurs',
  'Faire du reporting hebdomadaire à la direction',
  'Organiser et animer les réunions de sprints',
  "Concevoir l'architecture technique des projets",
  'Participer à la revue de code',
  'Rédiger la documentation technique',
  'Collaborer avec les équipes produit et design',
  'Assurer la maintien en condition opérationnelle',
  'Déployer les applications en production',
  'Analyser les performances et optimiser le code',
]

const REQUIREMENTS_POOL = [
  "Minimum 3 ans d'expérience en développement",
  'Bonne maîtrise de TypeScript',
  'Expérience avec un framework moderne (React, Vue, etc.)',
  'Capacité à travailler en équipe',
  'Niveau anglais professionnel',
  'Expérience en gestion de projet',
  'Connaissance des bonnes pratiques DevOps',
  "Diplôme d'école d'ingénieur ou équivalent",
  'Bonne communication écrite et orale',
  'Disponibilité immédiate',
]

function pickRandom<T>(arr: T[], min = 2, max = 5): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count)
}

export const JobFactory = factory
  .define(Job, async ({ faker }) => {
    const title = faker.person.jobTitle()

    return {
      slug: faker.helpers
        .slugify(`${title}-${faker.number.int({ min: 100, max: 999 })}`)
        .toLowerCase(),
      title,
      summary: faker.lorem.sentences(3),
      reportsTo: faker.person.fullName(),
      department: faker.helpers.arrayElement(DEPARTMENTS),
      responsibilities: pickRandom(RESPONSIBILITIES_POOL),
      requirements: pickRandom(REQUIREMENTS_POOL),
      salary: faker.number.int({ min: 3000, max: 15000 }) * 100,
      employmentType: faker.helpers.arrayElement(EMPLOYMENT_TYPES),
      isActive: faker.datatype.boolean({ probability: 0.8 }),
      postedAt: DateTime.fromJSDate(faker.date.recent({ days: 365 })),
      expiresAt: DateTime.fromJSDate(faker.date.soon({ days: 365 })),
    }
  })
  .state('inactive', () => ({
    isActive: false,
    postedAt: null,
    expiresAt: null,
  }))
  .build()
