import type { ChurchServiceCategory } from '#shared/types/service.types.ts'

export type ServiceCategoryMeta = {
  id: ChurchServiceCategory
  title: string
  description: string
  /** Icon chip classes */
  chip: string
  /** Accent bar / underline color */
  accent: string
  /** Minimal hero background */
  hero: string
}

export const serviceCategories: Record<ChurchServiceCategory, ServiceCategoryMeta> = {
  sacrements: {
    id: 'sacrements',
    title: 'Sacrements de la vie chrétienne',
    description:
      'Les sacrements, signes sensibles de la grâce de Dieu, accompagnent le chrétien de sa naissance à son dernier souffle.',
    chip: 'bg-catholic-blue/10 text-catholic-blue dark:text-blue-400',
    accent: 'bg-catholic-blue',
    hero: 'bg-linear-to-r from-catholic-blue to-catholic-blue/80',
  },
  sacramentaux: {
    id: 'sacramentaux',
    title: 'Sacramentaux et prières',
    description:
      "Bénédictions et intentions de messe : l'Église prie avec vous et pour vous, dans les joies comme dans les épreuves.",
    chip: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    accent: 'bg-amber-500',
    hero: 'bg-linear-to-r from-amber-600 to-amber-500',
  },
  accompagnement: {
    id: 'accompagnement',
    title: 'Accompagnement et célébrations',
    description:
      "Écoute, médiation, enseignement et traditions : l'Église se tient aux côtés de chacun, dans les joies comme dans les épreuves.",
    chip: 'bg-catholic-red/10 text-catholic-red dark:text-red-400',
    accent: 'bg-catholic-red',
    hero: 'bg-linear-to-r from-catholic-red to-catholic-red/80',
  },
}
