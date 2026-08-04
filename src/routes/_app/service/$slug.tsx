import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CakeIcon,
  CalendarHeartIcon,
  ChevronRightIcon,
  CrossIcon,
  DropletsIcon,
  EarIcon,
  FlameIcon,
  GemIcon,
  HandHeartIcon,
  HandshakeIcon,
  InfoIcon,
  MicIcon,
  ShieldIcon,
  UserRoundIcon,
} from 'lucide-react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { serviceCategories } from '#/config/service-categories.ts'
import { services } from '#/config/services.ts'
import { pageMetadata } from '#/utils/seo.ts'
import { getServiceBySlug } from '#/utils/service.ts'
import { createSlug } from '#/utils/string.ts'
import { Alert, AlertDescription } from '#shared/components/ui/alert'
import { buttonVariants } from '#shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card'
import Hero from '#shared/layouts/app/components/hero.tsx'
import { cn } from '#shared/lib/utils.ts'
import type {
  ChurchService,
  ChurchServiceContentBlock,
  ChurchServiceId,
} from '#shared/types/service.types.ts'

const serviceIcons: Record<ChurchServiceId, LucideIcon> = {
  christian_initiation: DropletsIcon,
  mass_intention: CalendarHeartIcon,
  confession: EarIcon,
  sick: CrossIcon,
  marriage: GemIcon,
  funerals: FlameIcon,
  exorcism: ShieldIcon,
  benediction: HandHeartIcon,
  conference: MicIcon,
  mediation: HandshakeIcon,
  quinceanera: CakeIcon,
}

export const Route = createFileRoute('/_app/service/$slug')({
  loader: ({ params }) => {
    const service = getServiceBySlug(params.slug)

    if (!service) {
      throw notFound()
    }

    return service
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? pageMetadata(loaderData.title, {
          metadata: { description: loaderData.description },
        })
      : undefined,
  }),
  component: ServiceDetailPage,
})

function ServiceDetailPage() {
  const service = Route.useLoaderData()
  const category = serviceCategories[service.category]
  const Icon = serviceIcons[service.id]
  const headings = service.content
    .filter(
      (block): block is Extract<ChurchServiceContentBlock, { type: 'heading' }> =>
        block.type === 'heading'
    )
    .map((block) => ({ id: createSlug(block.text), text: block.text }))

  const related = services
    .filter((item) => item.category === service.category && item.id !== service.id)
    .sort((a, b) => a.title.localeCompare(b.title, 'fr'))

  return (
    <>
      <Hero
        variant="minimal"
        size="sm"
        backgroundColor={category.hero}
        title={service.title}
        subtitle={service.description}
      />

      <div className="container mx-auto max-w-7xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
        <nav aria-label="Fil d'Ariane">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="transition hover:text-foreground">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/services" className="transition hover:text-foreground">
                Services
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-foreground">
              {service.title}
            </li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0">
            <div className="flex flex-col gap-6 rounded-2xl bg-muted p-7 sm:flex-row sm:items-center">
              <span
                className={cn(
                  'flex size-14 shrink-0 items-center justify-center rounded-full',
                  category.chip
                )}
              >
                <Icon className="size-7" />
              </span>
              <div>
                <p className="text-xs font-semibold tracking-[0.25em] text-secondary uppercase">
                  {category.title}
                </p>
                <p className="mt-2 leading-relaxed text-muted-foreground">{service.description}</p>
              </div>
            </div>

            <div className="mt-10 max-w-3xl">
              <ServiceContent content={service.content} />
            </div>

            <RequestCta />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:self-start">
            <RequestCard />

            {headings.length > 0 && <TocCard headings={headings} />}

            {related.length > 0 && <RelatedCard items={related} categoryTitle={category.title} />}
          </aside>
        </div>
      </div>
    </>
  )
}

function ServiceContent({ content }: { content: ChurchServiceContentBlock[] }) {
  return (
    <div className="space-y-6">
      {content.map((block, index) => (
        <ContentBlock key={index} block={block} />
      ))}
    </div>
  )
}

function ContentBlock({ block }: { block: ChurchServiceContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-lg/relaxed text-muted-foreground">
          <RichText text={block.text} />
        </p>
      )
    case 'heading':
      return (
        <h2
          id={createSlug(block.text)}
          className="scroll-mt-[calc(var(--header-height)+1rem)] pt-6 text-2xl font-bold tracking-tight text-foreground"
        >
          {block.text}
        </h2>
      )
    case 'list':
      return (
        <ul className="space-y-3">
          {block.items.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-lg/relaxed text-muted-foreground"
            >
              <span className="mt-3 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      )
    case 'blockquote':
      return (
        <blockquote className="border-l-4 border-secondary pl-6 text-lg/relaxed text-muted-foreground italic">
          <RichText text={block.text} />
        </blockquote>
      )
    case 'note':
      return (
        <p className="text-base/relaxed text-muted-foreground italic">
          <RichText text={block.text} />
        </p>
      )
    case 'info':
      return (
        <Alert variant="info">
          <InfoIcon />
          <AlertDescription>
            <RichText text={block.text} />
          </AlertDescription>
        </Alert>
      )
    case 'ooc':
      return (
        <div className="rounded-xl border border-dashed border-foreground/25 bg-muted/60 p-6">
          <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
            (( Avertissement hors roleplay ))
          </p>
          <div className="mt-4 text-sm/relaxed text-muted-foreground">
            <RichText block text={block.text} />
          </div>
        </div>
      )
  }
}

const richTextComponents: Components = {
  p: ({ children }) => <>{children}</>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children }) => <span>{children}</span>,
}

function RichText({ text, block = false }: { text: string; block?: boolean }) {
  return (
    <ReactMarkdown
      components={
        block
          ? {
              ...richTextComponents,
              p: ({ children }) => <p className="mb-3 leading-relaxed last:mb-0">{children}</p>,
            }
          : richTextComponents
      }
    >
      {text}
    </ReactMarkdown>
  )
}

function RequestCta() {
  return (
    <div className="mt-14 flex flex-col items-start gap-6 rounded-2xl border border-border bg-primary p-8 text-primary-foreground sm:flex-row sm:items-center">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-card/10">
        <UserRoundIcon className="size-6" />
      </span>
      <div className="flex-1">
        <h3 className="text-lg font-bold">Une demande ou une question&nbsp;?</h3>
        <p className="mt-1 text-sm/relaxed text-primary-foreground">
          Faites-vous connaître de votre paroisse : un prêtre ou un diacre vous répondra et vous
          accompagnera dans les démarches.
        </p>
      </div>
      <Link
        to="/register-parishioner"
        className={buttonVariants({ variant: 'secondary', className: 'h-11 shrink-0 gap-2' })}
      >
        <UserRoundIcon className="size-4" /> S'enregistrer comme paroissien
      </Link>
    </div>
  )
}

function RequestCard() {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Demander ce service</CardTitle>
        <CardDescription>
          La démarche se fait auprès de votre paroisse ou de l'archidiocèse.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link
          to="/register-parishioner"
          className={buttonVariants({ variant: 'default', className: 'h-11 w-full gap-2' })}
        >
          <UserRoundIcon className="size-4" /> S'enregistrer comme paroissien
        </Link>
        <Link
          to="/services"
          className={buttonVariants({ variant: 'outline', className: 'h-11 w-full gap-2' })}
        >
          <ArrowLeftIcon className="size-4" /> Tous les services
        </Link>
      </CardContent>
    </Card>
  )
}

function TocCard({ headings }: { headings: { id: string; text: string }[] }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Sur cette page</CardTitle>
      </CardHeader>
      <CardContent>
        <nav className="space-y-1" aria-label="Sommaire">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground/60 transition group-hover:text-primary" />
              {heading.text}
            </a>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}

function RelatedCard({ items, categoryTitle }: { items: ChurchService[]; categoryTitle: string }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Autres services</CardTitle>
        <CardDescription>{categoryTitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.id}
            to="/service/$slug"
            params={{ slug: item.slug }}
            className="group flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm transition hover:bg-muted"
          >
            <span>{item.title}</span>
            <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
