import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, MapPinIcon, NotebookIcon } from 'lucide-react'
import {
  ChurchEventsMonthList,
  ChurchEventsMonthListSkeleton,
} from '#/features/church-event/components/church-events-month-list.tsx'
import type { RoutePath } from '#/shared/types/route.types'
import { Skeleton } from '#shared/components/ui/skeleton.tsx'
import Hero from '#shared/layouts/app/components/hero.tsx'

const sidebarCTAs = [
  {
    icon: MapPinIcon,
    title: 'Nos paroisses',
    description:
      'Trouvez une paroisse catholique près de chez vous ainsi que ses horaires et coordonnées.',
    to: '/parishes' as const,
  },
  {
    icon: NotebookIcon,
    title: 'Devenir paroissien',
    description:
      "Devenez membre des paroisses de l'Archidiocèse et participez pleinement à la vie de votre communauté.",
    to: '/register-parishioner' as const,
  },
]

export function ChurchEventsPage() {
  return (
    <>
      <Hero
        variant="minimal"
        backgroundColor="bg-linear-to-r from-primary to-catholic-gold"
        title="Événements"
        subtitle="Consultez les événements et les activités à venir dans notre archidiocèse"
      />
      <main className="max-w-8xl container mx-auto px-4 pt-14 pb-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <ChurchEventsMonthList />
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <EventsSidebarSection />
          </aside>
        </div>
      </main>
    </>
  )
}

function EventsSidebarSection() {
  return (
    <div className="space-y-6">
      {sidebarCTAs.map(({ icon: Icon, title, description, to }) => (
        <SidebarCTACard key={to} icon={Icon} title={title} description={description} to={to} />
      ))}
    </div>
  )
}

function SidebarCTACard({
  icon: Icon,
  title,
  description,
  to,
}: {
  icon: typeof MapPinIcon
  title: string
  description: string
  to: RoutePath
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/10 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-5" />
      </span>
      <div>
        <div className="leading-snug font-bold">{title}</div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        En savoir plus
        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

export function ChurchEventsPageSkeleton() {
  return (
    <>
      <Hero
        variant="minimal"
        backgroundColor="bg-linear-to-r from-primary to-catholic-gold"
        title="Événements"
        subtitle="Consultez les événements et les activités à venir dans notre archidiocèse"
      />
      <main className="container mx-auto max-w-7xl px-4 pt-14 pb-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <ChurchEventsMonthListSkeleton />
          </div>
          <aside className="space-y-6">
            <EventsSidebarSectionSkeleton />
          </aside>
        </div>
      </main>
    </>
  )
}

function EventsSidebarSectionSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-2 h-6 w-44" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl p-3 ring-1 ring-foreground/10"
            >
              <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-5 w-2/4" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {sidebarCTAs.map(({ title }) => (
        <div key={title} className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
          <Skeleton className="size-11 rounded-xl" />
          <Skeleton className="mt-4 h-5 w-32" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-1.5 h-4 w-3/4" />
        </div>
      ))}
    </div>
  )
}
