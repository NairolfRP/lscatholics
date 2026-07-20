import { createFileRoute, Link } from '@tanstack/react-router'
import { CalendarIcon, ChevronRightIcon, MapPinIcon, NotebookIcon } from 'lucide-react'
import { CTACard } from '#/features/home/components/cta-card'
import { LatestEventsSection } from '#/features/home/components/latest-events-section'
import { LatestPostsSection } from '#/features/home/components/latest-posts-section'
import { NextChurchEvent } from '#/features/home/components/next-church-event'
import { homeCTA } from '#/features/home/constants/home-cta'
import { stats } from '#/features/home/constants/stats'
import { buttonVariants } from '#/shared/components/ui/button'
import { Typography } from '#/shared/components/ui/typography'
import Hero from '#/shared/layouts/app/components/hero'
import { cn } from '#/shared/lib/utils'

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
          <Typography variant="h1" className="mb-6 text-5xl md:text-4xl">
            Bienvenue sur le site de{' '}
            <span className="text-gradient block text-secondary">l'Archidiocèse de Los Santos</span>
          </Typography>
        }
        subtitle="Rejoignez-nous dans la prière, la communion et le service au sein de l'Église catholique à Los Santos"
        actions={[
          {
            label: (
              <>
                <CalendarIcon /> Prochain événements
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

      <main className="contents space-y-15">
        <section className="container mx-auto grid grid-cols-1 gap-8 px-2 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {homeCTA.map((item) => (
            <CTACard key={item.title} item={item} />
          ))}
        </section>

        <section className="container mx-auto px-2">
          <Typography variant="h2" className="mb-5 border-b text-center">
            Rejoignez nos paroisses
          </Typography>
          <div className="grid grid-cols-1 items-center justify-center gap-3 md:grid-cols-2 md:gap-0">
            <Link
              to="/parishes"
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'lg' }),
                'flex flex-col py-10 text-xl font-bold md:flex-row md:rounded-r-none'
              )}
            >
              <MapPinIcon className="mr-3 size-5" /> Nos paroisses
            </Link>
            <Link
              to="/register-parishioner"
              className={cn(
                buttonVariants({ variant: 'default', size: 'lg' }),
                'flex flex-col py-10 text-xl font-bold md:flex-row md:rounded-l-none'
              )}
            >
              <NotebookIcon className="mr-3 size-5" /> S'enregistrer comme paroissien
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-2">
          <div className="grid grid-cols-1 gap-20 md:grid-cols-2 md:gap-8">
            <div>
              <div className="flex items-center justify-between">
                <Typography variant="h2" className="border-none">
                  Dernières actualités
                </Typography>
                <Link to="/newsroom" className="flex items-center gap-1 text-sm underline">
                  Tous les articles <ChevronRightIcon className="size-(--text-sm)" />
                </Link>
              </div>

              <LatestPostsSection />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Typography variant="h2" className="border-none">
                  Prochains événements
                </Typography>
                <Link to="/events" className="flex items-center gap-1 text-sm underline">
                  Tous les events <ChevronRightIcon className="size-(--text-sm)" />
                </Link>
              </div>

              <LatestEventsSection />
            </div>
          </div>
        </section>

        <section className="bg-secondary py-16">
          <div className="container mx-auto px-2">
            <div className="grid gap-12 text-center md:grid-cols-4 md:gap-8">
              {stats.map(({ value, label, colorClass }) => (
                <div key={label} className="space-y-2">
                  <div className={`text-4xl font-bold ${colorClass}`}>{value}</div>
                  <div className="text-sm font-medium tracking-wide text-gray-900 uppercase">
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
