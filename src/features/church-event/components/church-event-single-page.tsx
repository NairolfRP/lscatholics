import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CalendarX2Icon,
  ChurchIcon,
  MapPinIcon,
  TicketsIcon,
  UsersIcon,
} from 'lucide-react'
import { singleChurchEventQueryOptions } from '#/features/church-event/queries.ts'
import { formatDateTime } from '#/utils/date.ts'
import { Alert, AlertTitle } from '#shared/components/ui/alert.tsx'
import { Badge } from '#shared/components/ui/badge.tsx'
import { buttonVariants } from '#shared/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card.tsx'
import { Markdown } from '#shared/components/ui/markdown.tsx'
import { Separator } from '#shared/components/ui/separator.tsx'
import { getParishInfo } from '#shared/constants/parish.ts'
import Hero from '#shared/layouts/app/components/hero.tsx'

export function ChurchEventSinglePage() {
  const { slug } = useParams({ from: '/_app/event/$slug' })
  const { data: churchEvent } = useSuspenseQuery(singleChurchEventQueryOptions(slug))

  const startDate = churchEvent.startDate
  const endDate = churchEvent.endDate
  const isSameDay = endDate && startDate.toDateString() === endDate.toDateString()

  const now = new Date()
  const isExpired = (endDate && now > endDate) || (!endDate && now > startDate)

  const parish = churchEvent.parish ? getParishInfo(churchEvent.parish) : null

  return (
    <article className="contents">
      <Hero
        variant="image"
        imageSrc={churchEvent.coverImageUrl}
        title={
          <>
            {parish && (
              <Badge
                variant="secondary"
                className="mb-4 bg-white/90 text-neutral-900 hover:bg-white"
              >
                {parish.title}
              </Badge>
            )}
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white md:text-5xl">
              {churchEvent.title}
            </h1>
          </>
        }
        subtitle={churchEvent.description}
        size="sm"
      />

      <div className="container mx-auto max-w-5xl px-4 pt-5 pb-20 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Link to="/events" className={buttonVariants({ size: 'lg' })}>
            <ArrowLeftIcon /> Retour vers la liste des événements
          </Link>

          {isExpired && (
            <Alert variant="destructive">
              <CalendarX2Icon />
              <AlertTitle>Cet événement est terminé</AlertTitle>
            </Alert>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 pt-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">À propos de l'événement</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none prose-neutral prose-headings:font-semibold prose-p:leading-relaxed">
                <Markdown content={churchEvent.content} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Détails pratiques</CardTitle>
                <CardDescription>Toutes les informations pour participer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-muted p-2">
                    <CalendarDaysIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {endDate && !isSameDay && 'Du '}
                      {formatDateTime(startDate)}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      {endDate && !isSameDay && (
                        <>
                          <span>au {formatDateTime(endDate)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-muted p-2">
                    <MapPinIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Lieu</p>
                    <p className="text-sm text-muted-foreground">{churchEvent.location}</p>
                  </div>
                </div>

                {parish && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-muted p-2">
                      <ChurchIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Paroisse</p>
                      <p className="text-sm text-muted-foreground capitalize">{parish.title}</p>
                    </div>
                  </div>
                )}
                {churchEvent.registrationRequired && (
                  <>
                    {churchEvent.maxParticipants && (
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-muted p-2">
                          <UsersIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Capacité</p>
                          <p className="text-sm text-muted-foreground">
                            {churchEvent.maxParticipants} places maximum
                          </p>
                        </div>
                      </div>
                    )}

                    <Alert variant="warning">
                      <TicketsIcon />
                      <AlertTitle>Inscription requise</AlertTitle>
                    </Alert>
                  </>
                )}
              </CardContent>

              <Separator />

              <CardFooter>
                {churchEvent.flyerUrl && (
                  <a href={churchEvent.flyerUrl} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={churchEvent.flyerUrl}
                      alt="Affiche de l'événement"
                      title="Affiche de l'événement"
                      layout="constrained"
                      width={300}
                      height={500}
                      loading="lazy"
                    />
                  </a>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </article>
  )
}
