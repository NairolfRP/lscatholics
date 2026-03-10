import Head from '@/shared/components/app-head'
import { Link } from '@adonisjs/inertia/react'
import { ArrowRight, CircleAlert, Clock, MapPin } from 'lucide-react'
import { Typography } from '@/shared/components/ui/typography'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { urlFor } from '@/client'
import type { Data } from '@generated/data'
import { InertiaProps } from '@/types'

type PageProps = InertiaProps<{
  events: Data.ScheduledEvents.ScheduledEvent.Variants['publicList'][]
  error: boolean
}>

function formatDay(date: Date) {
  return date.getDate().toString()
}

function formatMonth(date: Date) {
  return date.toLocaleDateString('fr-FR', { month: 'short' })
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export default function EventsPage({ events, error }: PageProps) {
  return (
    <>
      <Head title="Événements" />

      <HeroSection bgColor="bg-linear-to-r from-catholic-blue to-catholic-gold" py="16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Événements</h1>
        <p className="text-xl opacity-90">
          Participez à la vie spirituelle et communautaire de notre archidiocèse
        </p>
      </HeroSection>

      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <Typography
            variant="h2"
            className="border-none text-3xl font-bold text-catholic-purple mb-8 text-center font-serif"
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
            <div className="w-full text-center mx-auto font-medium italic">
              Aucun événement à venir
            </div>
          )}

          {!error && events && events.length > 0 && (
            <div className="space-y-6">
              {events.map((event) => (
                <Link key={event.id} href={urlFor('event', { slug: event.slug })}>
                  <Card className="card-hover cursor-pointer overflow-hidden hover:shadow-lg transition-shadow p-0">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        {event.coverImageUrl ? (
                          <div
                            className="aspect-video md:aspect-square md:h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${event.coverImageUrl})` }}
                          />
                        ) : (
                          <div className="aspect-video md:aspect-square bg-gray-200 md:h-full" />
                        )}
                      </div>
                      <CardContent className="md:w-2/3 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-4 mb-4">
                            {event.startDate && (
                              <div className="text-center">
                                <div className="text-2xl font-bold text-catholic-gold">
                                  {formatDay(new Date(event.startDate))}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {formatMonth(new Date(event.startDate))}
                                </div>
                              </div>
                            )}
                            <div>
                              <h3 className="text-xl font-bold text-catholic-purple mb-1">
                                {event.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                {event.startDate && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {formatTime(new Date(event.startDate))}
                                  </div>
                                )}
                                {event.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {event.location}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4 leading-relaxed">{event.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {event.registrationRequired && (
                              <Badge variant="secondary">Inscription requise</Badge>
                            )}
                            {event.registrationRequired && event.maxParticipants && (
                              <Badge variant="outline">Places limitées</Badge>
                            )}
                          </div>
                          <Button>
                            En savoir plus
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
