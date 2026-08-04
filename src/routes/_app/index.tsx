import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRightIcon,
  CalendarIcon,
  ChevronRightIcon,
  MapPinIcon,
  NotebookIcon,
} from 'lucide-react'
import { CTACard } from '#/features/home/components/cta-card'
import { LatestEventsSection } from '#/features/home/components/latest-events-section'
import { LatestPostsSection } from '#/features/home/components/latest-posts-section'
import { NextChurchEvent } from '#/features/home/components/next-church-event'
import { homeCTA } from '#/features/home/constants/home-cta'
import { stats } from '#/features/home/constants/stats'
import { Separator } from '#/shared/components/ui/separator'
import { Typography } from '#/shared/components/ui/typography'
import Hero from '#/shared/layouts/app/components/hero'
import { cn } from '#/shared/lib/utils'
import type { RoutePath } from '#/shared/types/route.types'

export const Route = createFileRoute('/_app/')({ component: Home })

function Home() {
  return (
    <>
      <Hero
        variant="image"
        size="lg"
        imageSrc="/assets/images/cathedral-mass-with-cardinal.webp"
        imageAlt="Cathedral interior"
        align="center"
        title={
          <Typography variant="h1">
            Bienvenue sur le site de{' '}
            <span className="block bg-linear-135 from-[#f0c14b] via-[#e0a83e] to-[#b8860b] bg-clip-text text-transparent">
              l'Archidiocèse de Los Santos
            </span>
          </Typography>
        }
        subtitle="Rejoignez-nous dans la prière, la communion et le service au sein de l'Église catholique à Los Santos"
        actions={[
          {
            label: (
              <>
                <CalendarIcon /> Prochain événement
              </>
            ),
            variant: 'secondary',
            href: '/events',
          },
          { label: 'Découvrir notre communauté', href: '/about' },
        ]}
      >
        <NextChurchEvent />
      </Hero>

      <main className="contents">
        <section className="container mx-auto grid grid-cols-1 gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {homeCTA.map((item) => (
            <CTACard key={item.title} item={item} />
          ))}
        </section>

        <ParishSection />

        <section className="container mx-auto px-4 pt-16 pb-20 lg:px-8">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeader
                eyebrow="Actualités"
                title="Dernières actualités"
                to="/newsroom"
                linkLabel="Tous les articles"
              />
              <LatestPostsSection />
            </div>

            <div>
              <SectionHeader
                eyebrow="Agenda"
                title="Prochains événements"
                to="/events"
                linkLabel="Tous les événements"
              />
              <LatestEventsSection />
            </div>
          </div>
        </section>

        <section className="bg-secondary py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 gap-12 text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map(({ icon: Icon, value, label, colorClass }) => (
                <div key={label} className="space-y-3">
                  <span
                    className={cn(
                      'mx-auto flex size-12 items-center justify-center rounded-full bg-black/10',
                      colorClass
                    )}
                  >
                    <Icon className="size-6" />
                  </span>
                  <div className={cn('text-4xl font-bold', colorClass)}>{value}</div>
                  <div className="text-sm font-medium tracking-wide text-secondary-foreground uppercase">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function SectionHeader({
  eyebrow,
  title,
  to,
  linkLabel,
}: {
  eyebrow: string
  title: string
  to: RoutePath
  linkLabel: string
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-semibold tracking-[0.3em] text-secondary uppercase">
          {eyebrow}
        </p>
        <Typography variant="h2" className="border-none pb-0">
          {title}
        </Typography>
      </div>
      <Link
        to={to}
        className="group flex shrink-0 items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        {linkLabel}
        <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}

const parishCTAs = [
  {
    icon: MapPinIcon,
    title: 'Nos paroisses',
    description:
      'Trouvez une paroisse catholique près de chez vous ou de votre lieu de visite ainsi que ses coordonnées.',
    buttonLabel: 'Découvrir les paroisses',
    to: '/parishes' as const,
  },
  {
    icon: NotebookIcon,
    title: "S'enregistrer comme paroissien",
    description:
      "Devenez membre des paroisses de l'Archidiocèse et participez pleinement à la vie de votre communauté.",
    buttonLabel: 'Commencer mon inscription',
    to: '/register-parishioner' as const,
  },
]

function ParishSection() {
  return (
    <section className="bg-muted/70 py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-secondary uppercase">
            Communauté
          </p>
          <Typography variant="h2" className="border-none">
            Rejoignez nos paroisses
          </Typography>
          <Separator className="mx-auto mt-4 h-1 w-24 bg-catholic-gold" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {parishCTAs.map(({ icon: Icon, title, description, buttonLabel, to }) => (
            <Link
              key={title}
              to={to}
              className="group flex flex-col gap-5 rounded-2xl bg-card p-8 ring-1 ring-foreground/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-secondary/20 text-secondary transition group-hover:bg-secondary group-hover:text-secondary-foreground">
                <Icon className="size-6" />
              </span>
              <div>
                <Typography variant="h3" className="text-xl">
                  {title}
                </Typography>
                <p className="mt-2 leading-relaxed text-muted-foreground">{description}</p>
              </div>
              <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-primary uppercase">
                {buttonLabel}
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
