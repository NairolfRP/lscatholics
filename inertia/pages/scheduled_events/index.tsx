import Head from '@/shared/components/app-head'
import { Link } from '@adonisjs/inertia/react'
import { ArrowRight, Calendar, CircleAlert, Clock, MapPin } from 'lucide-react'
import { Typography } from '@/shared/components/ui/typography'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { urlFor } from '@/lib/client'
import type { Data } from '@generated/data'
import { InertiaProps } from '@/shared/types/pages'
import { Container } from '@/shared/components/ui/container'

type PageProps = InertiaProps<{
  events: Data.ScheduledEvents.ScheduledEvent.Variants['publicList'][]
  error: boolean
}>

function formatDay(date: Date) {
  return date.getDate().toString().padStart(2, '0')
}

function formatMonth(date: Date) {
  return date.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatFullDate(date: Date) {
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function EventsPage({ events, error }: PageProps) {
  return (
    <>
      <Head title="Événements" />

      <HeroSection bgColor="bg-linear-to-r from-catholic-blue to-catholic-gold" py="16">
        <Typography variant="h1" className="text-4xl md:text-5xl font-bold mb-4">
          Événements
        </Typography>
        <Typography className="text-inherit text-xl opacity-90">
          Participez à la vie spirituelle et communautaire de notre archidiocèse
        </Typography>
      </HeroSection>

      <Container as="section" className="py-10 md:py-16">
        <Typography
          variant="h2"
          className="border-none text-2xl md:text-3xl font-bold text-catholic-purple mb-6 md:mb-10 text-center"
        >
          Événements à venir
        </Typography>

        {error && (
          <div className="max-w-4xl mx-auto px-3">
            <Alert variant="destructive">
              <CircleAlert />
              <AlertTitle>Impossible de charger les événements</AlertTitle>
              <AlertDescription>
                Nous n'avons pas pu récupérer les événements à venir. Cela peut être dû à un
                problème serveur ou réseau. Réessayez plus tard.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {!error && (!events || events.length === 0) && (
          <div className="w-full text-center mx-auto font-medium italic text-muted-foreground py-16">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            Aucun événement à venir
          </div>
        )}

        {!error && events && events.length > 0 && (
          <div className="space-y-4 md:space-y-5">
            {events.map((event) => (
              <Link key={event.id} href={urlFor('event', { slug: event.slug })} className="block">
                <Card className="group overflow-hidden hover:shadow-md transition-all duration-200 p-0 border border-gray-100 hover:border-catholic-gold/30">
                  <div className="flex">
                    <div className="flex flex-col items-center justify-start pt-5 px-3 md:px-5 shrink-0 w-14 md:w-20 border-r border-gray-100">
                      {event.startDate ? (
                        <>
                          <span className="text-xl md:text-3xl font-bold leading-none text-catholic-gold tabular-nums">
                            {formatDay(new Date(event.startDate))}
                          </span>
                          <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide mt-0.5">
                            {formatMonth(new Date(event.startDate))}
                          </span>
                        </>
                      ) : (
                        <Calendar className="w-5 h-5 text-gray-300" />
                      )}
                    </div>

                    <div className="flex flex-1 min-w-0 flex-col md:flex-row">
                      {event.coverImageUrl && (
                        <div
                          className="hidden md:block md:w-44 md:shrink-0 bg-cover bg-center order-last"
                          style={{ backgroundImage: `url(${event.coverImageUrl})` }}
                        />
                      )}

                      <div className="flex-1 min-w-0 p-3 md:p-5 flex flex-col gap-2.5">
                        {event.coverImageUrl && (
                          <div
                            className="md:hidden h-36 -mx-3 -mt-3 mb-1 bg-cover bg-center"
                            style={{ backgroundImage: `url(${event.coverImageUrl})` }}
                          />
                        )}

                        <div>
                          <h3 className="text-base md:text-lg font-bold text-catholic-purple leading-snug group-hover:text-catholic-gold transition-colors duration-150 mb-1.5">
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                            {event.startDate && (
                              <>
                                <span className="hidden md:inline capitalize text-gray-400">
                                  {formatFullDate(new Date(event.startDate))}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 shrink-0" />
                                  {formatTime(new Date(event.startDate))}
                                </div>
                              </>
                            )}
                            {event.location && (
                              <div className="flex items-center gap-1 min-w-0">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
                          {event.description}
                        </p>

                        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                          <div className="flex flex-wrap gap-1.5">
                            {event.registrationRequired && (
                              <Badge variant="secondary" className="text-xs h-5 px-2">
                                Inscription requise
                              </Badge>
                            )}
                            {event.registrationRequired && event.maxParticipants && (
                              <Badge variant="outline" className="text-xs h-5 px-2">
                                Places limitées
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="shrink-0 text-xs h-7 px-2 text-catholic-purple hover:text-catholic-gold hover:bg-catholic-gold/5 gap-1"
                          >
                            En savoir plus
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </>
  )
}
