import HomepageBanner from '@/assets/images/cathedral-mass-with-cardinal.webp'
import { Link } from '@adonisjs/inertia/react'
import { Calendar } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { urlFor } from '@/client'
import type { Data } from '@generated/data'
import type { InertiaProps } from '@/types'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { Typography } from '@/shared/components/ui/typography'
import { HomeKeyFigures } from '@/features/home/components/home-key-figures'
import { HomeLatestPosts } from '@/features/home/components/home-latest-posts'
import { HomeParishCTA } from '@/features/home/components/home-parish-cta'
import { HomeQuickLinks } from '@/features/home/components/home-quick-links'
import { HomeUpcomingEvent } from '@/features/home/components/home-upcoming-event'

type PageProps = InertiaProps<{
  upcomingEvent?: Data.ScheduledEvents.ScheduledEvent.Variants['home']
  posts?: {
    data: Data.Posts.Post.Variants['homePosts'][]
    error?: string
  }
}>

export default function HomePage({ upcomingEvent, posts = { data: [] } }: PageProps) {
  return (
    <>
      <HeroSection
        bgImage={HomepageBanner}
        height="min-h-[50vh]"
        corner={<HomeUpcomingEvent event={upcomingEvent} />}
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
            <Button size="lg" className="bg-catholic-gold hover:bg-yellow-600 text-white" asChild>
              <Link href={urlFor('find.events')}>
                <Calendar className="w-5 h-5 mr-2" />
                Prochains événements
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
              asChild
            >
              <Link href={urlFor('about-us')}>Découvrir notre communauté</Link>
            </Button>
          </div>
        </div>
      </HeroSection>

      <HomeQuickLinks />

      <HomeParishCTA />

      <HomeLatestPosts posts={posts.data} error={posts.error} />

      <HomeKeyFigures />
    </>
  )
}
