import HomepageBanner from '@/assets/images/cathedral-mass-with-cardinal.webp'
import { Link } from '@adonisjs/inertia/react'
import {
  Briefcase,
  Calendar,
  CalendarIcon,
  ChessBishop,
  ChevronRight,
  type LucideIcon,
  MapPin,
  NotebookPen,
} from 'lucide-react'
import { Button, buttonVariants } from '@/shared/components/ui/button'
import type { Data } from '@generated/data'
import type { InertiaProps } from '@/shared/types/pages'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { Typography } from '@/shared/components/ui/typography'
import { HomeLatestPosts, LatestPostsSkeleton } from '@/features/home/components/home-latest-posts'
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { cn, formatDate, formatNumber, isExternalLink, yearsBetween } from '@/lib/utils'
import { SOCIAL_DISCORD } from '@/shared/constants/social.constants'
import type { ComponentType, ReactNode } from 'react'
import type { IconProps } from '@/shared/hooks/use_icon_props'
import type { RouteName } from '@/shared/types/routes'
import {
  ARCHDIOCESAN_HISTORY_START_DATE,
  ARCHDIOCESAN_NB_OF_FAITHFUL,
} from '@/shared/constants/archdiocese.constants'
import {
  HomeUpcomingEvents,
  UpcomingEventsSkeleton,
} from '@/features/home/components/home-upcoming-events'
import { WhenVisible } from '@inertiajs/react'

type PageProps = InertiaProps<{
  upcomingEvents?: {
    data: Data.ScheduledEvents.ScheduledEvent.Variants['home'][]
    error?: string
  }
  latestPosts?: {
    data: Data.Posts.Post.Variants['homePosts'][]
    error?: string
  }
}>

type QuickCardItem = {
  icon?: ComponentType<IconProps> | LucideIcon
  title: string
  description?: string | ReactNode
  href: string | RouteName
}

const quickItems: QuickCardItem[] = [
  {
    icon: ChessBishop,
    title: 'Cardinal Ronan Callahan',
    href: 'archbishop.index',
    description: "Découvrez l'Archevêque de Los Santos : sa biographie, son blason, sa devise.",
  },
  {
    icon: Briefcase,
    title: "Offres d'emploi",
    href: 'jobs.index',
    description:
      "Explorez les opportunités d'emploi dans les paroisses, les départements et les entités de l'Archidiocèse",
  },
  {
    icon: Calendar,
    title: 'Prochains événements',
    href: 'find.events',
    description:
      'Informez-vous sur les messes, les célébrations et tous les autres événements à venir.',
  },
  {
    icon: SOCIAL_DISCORD.icon,
    title: '(( Rejoins notre serveur Discord ))',
    description:
      "Suivre l'actualité de la faction et consulter des ressources sur le roleplay catholique",
    href: SOCIAL_DISCORD.url,
  },
]

const stats = [
  { value: 288, label: 'Paroisses', colorClass: 'text-green-700' },
  { value: 42, label: 'Langues différentes', colorClass: 'text-catholic-purple' },
  {
    value: formatNumber(ARCHDIOCESAN_NB_OF_FAITHFUL),
    label: 'Catholiques',
    colorClass: 'text-catholic-red',
  },
  {
    value: yearsBetween(ARCHDIOCESAN_HISTORY_START_DATE, new Date()),
    label: "Ans d'histoire",
    colorClass: 'text-catholic-blue',
  },
]

export default function HomePage({
  latestPosts = { data: [] },
  upcomingEvents = { data: [] },
}: PageProps) {
  const nextEvent =
    upcomingEvents.data.length > 0 && !upcomingEvents.error ? upcomingEvents.data[0] : undefined

  return (
    <>
      <HeroSection
        bgImage={HomepageBanner}
        height="min-h-[50vh]"
        corner={<NextEvent event={nextEvent} />}
      >
        <div className="max-w-4xl mx-auto text-center">
          <Typography variant="h1" className="text-5xl md:text-6xl font-bold mb-6 font-serif">
            Bienvenue sur le site de
            <span className="text-gradient block">l'Archidiocèse de Los Santos</span>
          </Typography>
          <Typography className="text-white text-xl md:text-2xl mb-8 opacity-90">
            Rejoignez-nous dans la prière, la communion et le service au sein de l'Église catholique
            à Los Santos
          </Typography>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              route="find.events"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-catholic-gold hover:bg-yellow-600 text-white'
              )}
            >
              <CalendarIcon />
              Prochains événements
            </Link>
            <Link
              route="about-us"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'border-primary bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground'
              )}
            >
              Découvrir notre communauté
            </Link>
          </div>
        </div>
      </HeroSection>

      <main className="contents space-y-15">
        <section className="container mx-auto grid grid-cols-1 gap-8 px-2 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {quickItems.map((item) => (
            <QuickCard key={item.title} item={item} />
          ))}
        </section>

        <section className="container mx-auto px-2">
          <Typography variant="h2" className="mb-5 border-b text-center">
            Rejoignez nos paroisses
          </Typography>
          <div className="grid grid-cols-1 items-center justify-center gap-3 md:grid-cols-2 md:gap-0">
            <Link
              route="find.parishes"
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'lg' }),
                'flex flex-col py-10 text-xl font-bold md:flex-row md:rounded-r-none'
              )}
            >
              <MapPin className="mr-3 size-5" /> Nos paroisses
            </Link>
            <Link
              route="registerParishioner.index"
              className={cn(
                buttonVariants({ variant: 'default', size: 'lg' }),
                'flex flex-col py-10 text-xl font-bold md:flex-row md:rounded-l-none'
              )}
            >
              <NotebookPen className="mr-3 size-5" /> S'enregistrer comme paroissien
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
                <Link route="news.index" className="flex items-center gap-1 text-sm underline">
                  Tous les articles <ChevronRight className="size-(--text-sm)" />
                </Link>
              </div>

              <WhenVisible data="latestPosts" fallback={<LatestPostsSkeleton />}>
                <HomeLatestPosts posts={latestPosts.data} error={latestPosts.error} />
              </WhenVisible>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Typography variant="h2" className="border-none">
                  Prochains événements
                </Typography>
                <Link route="find.events" className="flex items-center gap-1 text-sm underline">
                  Tous les events <ChevronRight className="size-(--text-sm)" />
                </Link>
              </div>

              <WhenVisible data="upcomingEvents" fallback={<UpcomingEventsSkeleton />}>
                <HomeUpcomingEvents
                  upcomingEvents={upcomingEvents.data}
                  error={upcomingEvents.error}
                />
              </WhenVisible>
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

function QuickCard({ item: { icon: Icon, ...item } }: { item: QuickCardItem }) {
  const content = () => {
    return (
      <Card className="h-full transition hover:border hover:border-primary hover:shadow-lg">
        <CardHeader className="flex flex-col items-center text-center">
          {Icon && <Icon className="mb-2 size-8" />}
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isExternalLink(item.href)) {
    return (
      <a href={item.href} target="_blank">
        {content()}
      </a>
    )
  }

  return <Link route={item.href as RouteName}>{content()}</Link>
}

function NextEvent({ event }: { event?: Data.ScheduledEvents.ScheduledEvent.Variants['home'] }) {
  if (!event) return

  return (
    <Link route="event" routeParams={{ slug: event.slug }}>
      <div>
        <h3 className="font-semibold mb-2">Prochain événement</h3>
        <div className="space-y-1 text-xs">
          <div className="text-center">{formatDate(event.startDate!)}</div>

          <div className="font-bold">{event.title}</div>
          <div className="flex justify-end mt-4">
            <Button variant="ghost" size="sm">
              Voir plus <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
