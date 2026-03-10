import Head from '@/shared/components/app-head'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Typography } from '@/shared/components/ui/typography'
import { Button } from '@/shared/components/ui/button'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { MarkdownContent } from '@/shared/components/ui/markdown'
import type { Data } from '@generated/data'
import type { InertiaProps } from '@/types'

type PageProps = InertiaProps<{
  event: Data.ScheduledEvents.ScheduledEvent.Variants['publicDetails']
}>

function formatEventDate(date: string) {
  return format(new Date(date), "dd MMMM '@ 'HH:mm", { locale: fr })
}

function formatDetailDate(date: string) {
  return format(new Date(date), 'dd MMM HH:mm:ss', { locale: fr })
}

export default function EventSinglePage({ event }: PageProps) {
  return (
    <>
      <Head title={event.title}>
        <meta head-key="og:type" property="og:type" content="event" />
        <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
        {event.startDate && <meta property="event:start_time" content={event.startDate} />}
        {event.endDate && <meta property="event:end_time" content={event.endDate} />}
        <meta property="event:location" content={event.location} />
      </Head>

      <article>
        <header>
          <HeroSection bgImage={event.coverImageUrl || undefined} py="16" align="text-left">
            <div className="flex flex-col gap-5 text-left">
              <Typography variant="h1" className="md:text-5xl font-bold uppercase">
                {event.title}
              </Typography>
              <p className="text-xl font-bold opacity-90">
                {event.startDate ? formatEventDate(event.startDate) : 'Date inconnue'}
                {event.endDate && <span> - {formatEventDate(event.endDate)}</span>}
              </p>
            </div>
          </HeroSection>
        </header>

        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <Link route="find.events">
              <Button className="mb-10 cursor-pointer" size="lg">
                <ArrowLeft /> Tous les événements
              </Button>
            </Link>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="article-content">
                <MarkdownContent content={event.content} className="prose text-justify" />
              </div>

              <div className="space-y-3">
                <Typography variant="h3" className="font-bold">
                  Détails
                </Typography>

                <dl>
                  <dt className="text-primary uppercase text-sm font-bold">Début</dt>
                  <dd className="text-sm">
                    {event.startDate ? formatDetailDate(event.startDate) : 'Date inconnue'}
                  </dd>
                </dl>

                {event.endDate && (
                  <dl>
                    <dt className="text-primary uppercase text-sm font-bold">Fin</dt>
                    <dd className="text-sm">{formatDetailDate(event.endDate)}</dd>
                  </dl>
                )}

                {event.location && (
                  <dl>
                    <dt className="text-primary uppercase text-sm font-bold">Lieu</dt>
                    <dd className="text-sm">{event.location}</dd>
                  </dl>
                )}

                {event.registrationRequired && (
                  <dl>
                    <dt className="text-primary uppercase text-sm font-bold">
                      Inscription requise
                    </dt>
                    <dd className="text-sm">Oui</dd>
                  </dl>
                )}

                {event.registrationRequired && event.maxParticipants && (
                  <dl>
                    <dt className="text-primary uppercase text-sm font-bold">Nombre de places</dt>
                    <dd className="text-sm">{event.maxParticipants}</dd>
                  </dl>
                )}

                {event.flyerUrl && (
                  <img src={event.flyerUrl} alt="Event Flyer" width={791} height={1024} />
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
