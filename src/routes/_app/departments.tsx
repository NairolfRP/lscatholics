import type { LucideIcon } from 'lucide-react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArchiveIcon,
  ArrowRightIcon,
  BanknoteIcon,
  ChurchIcon,
  HandHeartIcon,
  LandmarkIcon,
  MegaphoneIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UsersIcon,
  WrenchIcon,
} from 'lucide-react'
import { departments } from '#/config/departments.ts'
import { pageMetadata } from '#/utils/seo.ts'
import Hero from '#shared/layouts/app/components/hero.tsx'
import type {
  Department,
  DepartmentCategory,
  DepartmentId,
} from '#shared/types/department.types.ts'

const departmentIcons: Record<DepartmentId, LucideIcon> = {
  archbishop_office: ChurchIcon,
  moderator_curia: LandmarkIcon,
  chancellor: ArchiveIcon,
  safety: ShieldCheckIcon,
  communications: MegaphoneIcon,
  general_services: WrenchIcon,
  human_resources: UsersIcon,
  financial_services: BanknoteIcon,
  general_counsel: ScaleIcon,
  charities: HandHeartIcon,
}

const categories: {
  id: DepartmentCategory
  title: string
  description: string
}[] = [
  {
    id: 'curia',
    title: 'La Curie',
    description:
      "Les offices centraux qui assistent l'Archevêque et le Modérateur de la Curie dans le gouvernement de l'archidiocèse.",
  },
  {
    id: 'services',
    title: 'Services et Opérations',
    description:
      'Les départements au service des paroisses, des fidèles et de la vie quotidienne de l\u2019archidiocèse.',
  },
  {
    id: 'charities',
    title: 'Charités',
    description:
      "Le bras social de l'archidiocèse, au service des plus démunis et de la justice sociale.",
  },
]

export const Route = createFileRoute('/_app/departments')({
  head: () => ({
    meta: pageMetadata('Départements'),
  }),
  component: DepartmentsPage,
})

function DepartmentsPage() {
  const sortedDepartments = [...departments].sort((a, b) =>
    (a.shortTitle ?? a.title).localeCompare(b.shortTitle ?? b.title, 'fr')
  )

  return (
    <>
      <Hero
        variant="minimal"
        title="Départements"
        subtitle="Les départements, bureaux et ministères au service de l'Archevêque, des paroisses et des fidèles de l'Archidiocèse de Los Santos."
      />
      <div className="container mx-auto max-w-7xl px-4 pt-15 pb-20 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {categories.map((category) => {
            const items = sortedDepartments.filter(
              (department) => department.category === category.id
            )

            return (
              <section key={category.id}>
                <header className="mb-8 max-w-3xl">
                  <h2 className="text-2xl font-bold tracking-tight text-secondary uppercase">
                    {category.title}
                  </h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                </header>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {items.map((department) => (
                    <DepartmentCard
                      key={department.id}
                      department={department}
                      icon={departmentIcons[department.id]}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </>
  )
}

function DepartmentCard({ department, icon: Icon }: { department: Department; icon: LucideIcon }) {
  return (
    <Link
      to="/department/$slug"
      params={{ slug: department.slug }}
      className="group flex h-full flex-col rounded-2xl bg-muted p-8 ring-1 ring-foreground/10 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-6" />
        </span>
        <ArrowRightIcon className="size-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-foreground">
        {department.shortTitle ?? department.title}
      </h3>
      <p className="mt-3 leading-relaxed text-muted-foreground">{department.description}</p>
    </Link>
  )
}
