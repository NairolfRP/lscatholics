import { services } from '#/config/services.ts'
import type { ChurchService, ChurchServiceCategory } from '#shared/types/service.types.ts'

export const getServiceBySlug = (slug: string): ChurchService | null =>
  services.find((service) => service.slug === slug) ?? null

export const getServicesByCategory = (category: ChurchServiceCategory): ChurchService[] =>
  services.filter((service) => service.category === category)
