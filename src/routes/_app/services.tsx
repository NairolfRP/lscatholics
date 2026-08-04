import type { LucideIcon } from 'lucide-react'
import {
  ArrowRightIcon,
  Building2Icon,
  CakeIcon,
  CalendarHeartIcon,
  CrossIcon,
  DropletsIcon,
  EarIcon,
  FlameIcon,
  GemIcon,
  HandHeartIcon,
  HandshakeIcon,
  MicIcon,
  ShieldIcon,
  UserRoundIcon,
} from 'lucide-react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { serviceCategories } from '#/config/service-categories.ts'
import { services } from '#/config/services.ts'
import { pageMetadata } from '#/utils/seo.ts'
import { buttonVariants } from '#shared/components/ui/button'
import Hero from '#shared/layouts/app/components/hero.tsx'
import { cn } from '#shared/lib/utils.ts'
import type { ChurchServiceCategory, ChurchServiceId } from '#shared/types/service.types.ts'

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

const categoryOrder: ChurchServiceCategory[] = ['sacrements', 'sacramentaux', 'accompagnement']

export const Route = createFileRoute('/_app/services')({
  head: () => ({
    meta: pageMetadata('Services', {
      metadata: {
        description:
          "Les sacrements, sacramentaux et services d'accompagnement proposés par l'Archidiocèse de Los Santos : baptême, confession, mariage, funérailles, bénédictions et plus encore.",
      },
    }),
  }),
  component: ServicesPage,
})

function ServicesPage() {
  return (
    <>
      <Hero
        variant="image"
        size="md"
        imageSrc="/assets/images/cathedralTower.webp"
        imageAlt="La tour de la cathédrale de Los Santos"
        imagePosition="50% 30%"
        align="center"
        title="Les services de l'Église"
        subtitle="Sacrements, sacramentaux et accompagnement : la grâce de Dieu se vit à chaque étape de la vie."
      />

      <section className="container mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:px-8">
        <Intro />

        <nav aria-label="Accès rapide aux catégories de services">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categoryOrder.map((id) => {
              const category = serviceCategories[id]
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className="rounded-full border border-foreground/15 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                >
                  {category.title}
                </a>
              )
            })}
          </div>
        </nav>

        <div className="mt-16 space-y-20">
          {categoryOrder.map((id) => (
            <CategorySection key={id} category={serviceCategories[id]} />
          ))}
        </div>

        <DepartmentsStrip />

        <ClosingCta />
      </section>
    </>
  )
}

function Intro() {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <p className="text-xs font-semibold tracking-[0.3em] text-secondary uppercase">
        Sacrements · Sacramentaux · Accompagnement
      </p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        La grâce de Dieu, à chaque instant de la vie
      </h2>
      <p className="mt-5 leading-relaxed text-muted-foreground">
        Du baptême qui ouvre la vie chrétienne aux obsèques qui l'accompagnent vers la demeure du
        Père, l'Église célèbre et bénit les grandes étapes de l'existence. Elle se tient aussi aux
        côtés de ceux qui souffrent, qui doutent ou qui cherchent.
      </p>
    </div>
  )
}

function CategorySection({
  category,
}: {
  category: (typeof serviceCategories)[ChurchServiceCategory]
}) {
  const items = services.filter((service) => service.category === category.id)

  return (
    <section id={category.id} className="scroll-mt-[calc(var(--header-height)+1.5rem)]">
      <header className="mb-8 flex items-start gap-5">
        <span className={cn('mt-1.5 h-10 w-1.5 shrink-0 rounded-full', category.accent)} />
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground uppercase">
            {category.title}
          </h3>
          <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">
            {category.description}
          </p>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            icon={serviceIcons[service.id]}
            category={category}
          />
        ))}
      </div>
    </section>
  )
}

function ServiceCard({
  service,
  icon: Icon,
  category,
}: {
  service: (typeof services)[number]
  icon: LucideIcon
  category: (typeof serviceCategories)[ChurchServiceCategory]
}) {
  return (
    <Link
      to="/service/$slug"
      params={{ slug: service.slug }}
      className="group flex h-full flex-col rounded-2xl bg-card p-6 ring-1 ring-foreground/10 transition hover:-translate-y-1 hover:shadow-xl hover:ring-primary/30"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-full',
            category.chip
          )}
        >
          <Icon className="size-6" />
        </span>
        <ArrowRightIcon className="size-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
      </div>
      <h4 className="mt-5 text-lg font-bold text-foreground">{service.title}</h4>
      <p className="mt-2 flex-1 leading-relaxed text-muted-foreground">{service.description}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        Découvrir
        <ArrowRightIcon className="size-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

function DepartmentsStrip() {
  return (
    <section className="mt-20 overflow-hidden rounded-2xl bg-primary">
      <div className="flex flex-col gap-8 p-8 text-primary-foreground md:flex-row md:items-center md:justify-between md:p-10">
        <div className="flex items-start gap-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10">
            <Building2Icon className="size-6" />
          </span>
          <div>
            <h3 className="text-xl font-bold">Des services encore plus vastes</h3>
            <p className="mt-2 max-w-xl text-sm/relaxed text-primary-foreground/70">
              Les départements de l'archidiocèse coordonnent l'administration, la communication, la
              sécurité et la vie des paroisses au service des fidèles.
            </p>
          </div>
        </div>
        <Link
          to="/departments"
          className={buttonVariants({
            variant: 'secondary',
            className: 'h-11 shrink-0 gap-2',
          })}
        >
          Découvrir les départements <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </section>
  )
}

function ClosingCta() {
  return (
    <section className="mt-20 rounded-2xl bg-muted p-10 text-center md:p-14">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <UserRoundIcon className="size-6" />
      </span>
      <h3 className="mt-6 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
        Une question sur un sacrement ou un service&nbsp;?
      </h3>
      <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
        La première étape est simple : faites-vous connaître de votre paroisse. Un prêtre ou un
        diacre pourra vous écouter, répondre à vos questions et vous guider dans la demande.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/register-parishioner"
          className={buttonVariants({ variant: 'default', className: 'h-11 gap-2 px-6' })}
        >
          <UserRoundIcon className="size-4" /> S'enregistrer comme paroissien
        </Link>
        <Link
          to="/parishes"
          className={buttonVariants({ variant: 'outline', className: 'h-11 gap-2 px-6' })}
        >
          Trouver une paroisse <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </section>
  )
}
