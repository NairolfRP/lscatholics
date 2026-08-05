import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, notFound, useParams } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { ArrowLeftIcon, CalendarDaysIcon, ScrollTextIcon, ShieldCheckIcon } from 'lucide-react'
import { DECREE_CATEGORIES } from '#/features/decree/constants/decree.constants.ts'
import { decreeQueryOptions } from '#/features/decree/queries.ts'
import type { Decree, DecreeField } from '#/features/decree/types/decree.types.ts'
import { formatDate } from '#/utils/date.ts'
import { Badge } from '#shared/components/ui/badge.tsx'
import { buttonVariants } from '#shared/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card.tsx'
import { Markdown } from '#shared/components/ui/markdown.tsx'
import { Skeleton } from '#shared/components/ui/skeleton.tsx'
import Hero from '#shared/layouts/app/components/hero.tsx'

export function DecreeSinglePage() {
  const { uid } = useParams({ from: '/_app/decrees/$uid' })
  const { data: decreeDetail } = useSuspenseQuery(decreeQueryOptions(uid))
  if (!decreeDetail) throw notFound()

  return (
    <article className="contents">
      <Hero
        variant="minimal"
        backgroundColor="bg-linear-to-r from-catholic-purple to-catholic-red"
        title={
          <>
            <Badge variant="secondary" className="mb-4 bg-white/90 text-neutral-900 hover:bg-white">
              {DECREE_CATEGORIES[decreeDetail.decree.category].label}
            </Badge>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white md:text-5xl">
              {decreeDetail.decree.title}
            </h1>
          </>
        }
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            {decreeDetail.decree.publishedAt && (
              <time
                dateTime={decreeDetail.decree.publishedAt}
                className="flex items-center gap-1.5 text-white/80"
              >
                <CalendarDaysIcon className="size-4" />
                {formatDate(decreeDetail.decree.publishedAt)}
              </time>
            )}
            {decreeDetail.decree.isEnacted && (
              <Badge variant="secondary" className="bg-white/90 text-neutral-900 hover:bg-white">
                <ScrollTextIcon /> Promulgué
              </Badge>
            )}
            {decreeDetail.decree.isInEffect && (
              <Badge variant="secondary" className="bg-white/90 text-neutral-900 hover:bg-white">
                <ShieldCheckIcon /> En vigueur
              </Badge>
            )}
          </span>
        }
      />

      <div className="container mx-auto max-w-4xl px-4 pt-5 pb-20 sm:px-6 lg:px-8">
        <Link to="/decrees" className={buttonVariants({ size: 'lg' })}>
          <ArrowLeftIcon /> Voir les autres décrets
        </Link>

        <div className="pt-10">
          <DecreeContent decree={decreeDetail.decree} />
        </div>
      </div>
    </article>
  )
}

function DecreeContent({ decree }: { decree: Decree }) {
  return (
    <Card className="overflow-hidden rounded-2xl">
      {decree.image && (
        <div className="mx-auto max-w-lg p-6 sm:p-8">
          <Image
            src={decree.image}
            alt="Sceau ou emblème associé au décret"
            className="w-full object-contain"
            loading="lazy"
            layout="constrained"
            width={640}
            height={360}
          />
        </div>
      )}

      {decree.description && (
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Texte du décret</CardTitle>
          <CardDescription>
            {DECREE_CATEGORIES[decree.category].label} — publié le{' '}
            {decree.publishedAt ? formatDate(decree.publishedAt) : 'date inconnue'}
          </CardDescription>
        </CardHeader>
      )}

      <CardContent className="prose max-w-none prose-neutral prose-headings:font-semibold prose-p:leading-relaxed">
        {decree.description && <Markdown content={decree.description} />}

        {decree.fields.length > 0 && (
          <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {decree.fields.map((field, index) => (
              <DecreeFieldItem key={index} field={field} />
            ))}
          </dl>
        )}
      </CardContent>
    </Card>
  )
}

function DecreeFieldItem({ field }: { field: DecreeField }) {
  return (
    <div className="rounded-xl bg-muted/50 p-4">
      <dt className="text-sm font-semibold text-foreground">{field.name}</dt>
      <dd className="mt-1.5 text-sm/relaxed text-muted-foreground [&_a]:underline">
        <Markdown content={field.value} />
      </dd>
    </div>
  )
}

export function DecreeSinglePageSkeleton() {
  return (
    <>
      <section className="relative flex w-full overflow-hidden bg-linear-to-r from-catholic-purple to-catholic-red pt-[calc(var(--header-height)+1rem)] pb-16">
        <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-center gap-5 px-6 md:px-10">
          <Skeleton className="h-6 w-40 rounded-full bg-white/20" />
          <Skeleton className="h-10 w-2/3 bg-white/20 sm:h-12 md:h-16" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-32 rounded-full bg-white/20" />
            <Skeleton className="h-6 w-24 rounded-full bg-white/20" />
            <Skeleton className="h-6 w-24 rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 pt-5 pb-20 sm:px-6 lg:px-8">
        <Skeleton className="h-11 w-64 rounded-lg" />

        <div className="pt-10">
          <Card className="overflow-hidden rounded-2xl">
            <CardHeader className="gap-3">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
