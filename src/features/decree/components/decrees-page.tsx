import type { LucideIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  FileTextIcon,
  GavelIcon,
  LandmarkIcon,
  ScrollTextIcon,
  StampIcon,
} from 'lucide-react'
import type { DecreeCategory } from '#/features/decree/constants/decree.constants.ts'
import {
  DECREE_CATEGORIES,
  DECREE_CATEGORY_ORDER,
} from '#/features/decree/constants/decree.constants.ts'
import { decreesQueryOptions } from '#/features/decree/queries.ts'
import type { DecreeListItem, DecreesIndex } from '#/features/decree/types/decree.types.ts'
import { formatDate } from '#/utils/date.ts'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '#shared/components/ui/alert.tsx'
import { Badge } from '#shared/components/ui/badge.tsx'
import { Button } from '#shared/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card.tsx'
import { Skeleton } from '#shared/components/ui/skeleton.tsx'
import Hero from '#shared/layouts/app/components/hero.tsx'
import { cn } from '#shared/lib/utils.ts'

const categoryIcons: Record<DecreeCategory, LucideIcon> = {
  executive: LandmarkIcon,
  law: ScrollTextIcon,
  administrative: StampIcon,
  judicial: GavelIcon,
}

export function DecreesPage() {
  const { data, isPending, isError, refetch } = useQuery(decreesQueryOptions)

  return (
    <>
      <Hero
        variant="minimal"
        backgroundColor="bg-linear-to-r from-catholic-purple to-catholic-red"
        title="Décrets et lois"
        subtitle="Les actes de droit canonique émis par l'Archevêché : décisions exécutives, lois canoniques, actes administratifs et jugements."
      />

      <main className="container mx-auto px-4 pt-8 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          <DecreesIntro />

          {isPending && <DecreesListSkeleton />}

          {isError && <DecreesError onRetry={refetch} />}

          {!isPending &&
            !isError &&
            (data.total === 0 ? <DecreesEmpty /> : <DecreesContent data={data} />)}
        </div>
      </main>
    </>
  )
}

function DecreesIntro() {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileTextIcon className="size-5 text-primary" />
          Le droit propre de l'Archidiocèse
        </CardTitle>
        <CardDescription className="text-pretty">
          Les décrets sont des décisions de droit canonique prises par l'Archevêque ou son délégué
          en matière exécutive, législative ou judiciaire. Le Chancelier est chargé de contresigner
          et de diffuser ces textes pour attester leur authenticité.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

function DecreesContent({ data }: { data: DecreesIndex }) {
  return (
    <div className="space-y-12">
      {DECREE_CATEGORY_ORDER.map((category) => (
        <DecreeCategorySection
          key={category}
          category={category}
          items={data.categories[category]}
        />
      ))}
    </div>
  )
}

function DecreeCategorySection({
  category,
  items,
}: {
  category: DecreeCategory
  items: DecreeListItem[]
}) {
  const config = DECREE_CATEGORIES[category]
  const Icon = categoryIcons[category]

  return (
    <section aria-labelledby={`category-${category}`}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-primary">
          <Icon className="size-5" />
        </span>
        <h2 id={`category-${category}`} className="text-2xl font-bold tracking-tight">
          {config.label}
        </h2>
        {items.length > 0 && (
          <Badge variant="secondary" className="h-6 rounded-full px-2.5">
            {items.length}
          </Badge>
        )}
      </div>

      <p className="mt-1.5 text-sm/relaxed text-muted-foreground">{config.description}</p>

      {items.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-foreground/20 px-4 py-6 text-center text-sm text-muted-foreground">
          Aucun texte publié dans cette catégorie pour le moment.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.map((item) => (
            <DecreeListItemRow key={item.uid} item={item} />
          ))}
        </ul>
      )}
    </section>
  )
}

function DecreeListItemRow({ item }: { item: DecreeListItem }) {
  return (
    <li>
      <Link
        to="/decrees/$uid"
        params={{ uid: item.uid }}
        preload={false}
        className="group flex items-center gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 transition hover:ring-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:p-5"
      >
        <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground/60 transition group-hover:translate-x-0.5 group-hover:text-primary" />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold transition-colors group-hover:text-catholic-gold">
            {item.title}
          </span>
          {item.publishedAt && (
            <span className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDaysIcon className="size-3.5 shrink-0" />
              <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
            </span>
          )}
        </span>
        <ArrowRightIcon className="hidden size-4 shrink-0 text-muted-foreground/60 transition group-hover:translate-x-0.5 group-hover:text-primary sm:block" />
      </Link>
    </li>
  )
}

function DecreesEmpty() {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-muted">
          <FileTextIcon className="size-7 text-muted-foreground" />
        </span>
        <div>
          <h3 className="text-lg font-semibold">Aucun décret publié</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Aucun décret n'a encore été promulgué. Revenez bientôt.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function DecreesError({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant="destructive" className="mx-auto max-w-2xl">
      <AlertCircleIcon />
      <AlertTitle>Décrets temporairement indisponibles</AlertTitle>
      <AlertDescription>
        Impossible de récupérer les décrets publiés par l'Archevêché. Réessayez dans quelques
        instants.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" onClick={onRetry}>
          Réessayer
        </Button>
      </AlertAction>
    </Alert>
  )
}

export function DecreesPageSkeleton() {
  return (
    <>
      <Hero
        variant="minimal"
        backgroundColor="bg-linear-to-r from-catholic-purple to-catholic-red"
        title="Décrets et lois"
        subtitle="Les actes de droit canonique émis par l'Archevêché : décisions exécutives, lois canoniques, actes administratifs et jugements."
      />

      <main className="container mx-auto px-4 pt-8 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          <Card className="rounded-2xl">
            <CardHeader className="gap-3">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </CardHeader>
          </Card>
          <DecreesListSkeleton />
        </div>
      </main>
    </>
  )
}

function DecreesListSkeleton() {
  return (
    <div className="space-y-12">
      {Array.from({ length: 2 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-5">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl" />
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-6 w-8 rounded-full" />
          </div>
          <Skeleton className="h-4 w-72" />
          <div className="space-y-3">
            <Skeleton className={cn('h-20 rounded-2xl', sectionIndex === 1 && 'opacity-60')} />
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className={cn('h-20 rounded-2xl', sectionIndex === 1 && 'opacity-60')} />
          </div>
        </div>
      ))}
    </div>
  )
}
