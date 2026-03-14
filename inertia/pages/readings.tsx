import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Head from '@/shared/components/app-head'
import { Typography } from '@/shared/components/ui/typography'
import { Button } from '@/shared/components/ui/button'
import { getReadingTypeLabel, liturgicalColor } from '@/shared/services/liturgy'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Container } from '@/shared/components/ui/container'

interface ReadingsMetadata {
  date: string
  zone: string
  couleur: string
  annee: string
  temps_liturgique: string
  semaine: string
  jour: string
  jour_liturgique_nom: string
  fete: string
  degre: string
  ligne1: string
  ligne2: string
  ligne3: string
  couleur2: string | null
  couleur3: string | null
}

interface Reading {
  type: string
  refrain_psalmique: string | null
  ref_refrain: string | null
  titre: string | null
  contenu: string
  ref: string
  intro_lue: string | null
  verset_evangile: string | null
  ref_verset: string | null
}

interface Mass {
  nom: string
  lectures: Reading[]
}

interface ReadingsResponse {
  informations: ReadingsMetadata
  messes: Mass[]
}

const READING_ORDER = ['lecture_1', 'psaume', 'lecture_2', 'evangile']

function sortReadings(readings: Reading[]): Reading[] {
  return READING_ORDER.map((v) => readings.find((r) => r.type === v) ?? null).filter(
    Boolean
  ) as Reading[]
}

function getLiturgicalHeader(info: ReadingsMetadata) {
  const mainName = info.jour_liturgique_nom || info.ligne1 || ''
  const subFeast = info.fete && info.fete !== mainName ? info.fete : null
  const subDegree =
    info.ligne3 ||
    (info.degre && info.degre !== mainName && info.degre !== info.fete ? info.degre : null)

  const weekday = info.date
    ? new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(new Date(info.date))
    : ''

  return {
    mainName,
    subFeast,
    subDegree,
    couleur: info.couleur,
    couleur2: info.couleur2,
    dateInfo: { weekday, semaine: info.semaine, annee: info.annee },
  }
}

function parseInline(text: string): React.ReactNode[] {
  const parts = text.split(
    /(<strong>[\s\S]*?<\/strong>|<em>[\s\S]*?<\/em>|<br\s?\/?>|\*\*[\s\S]*?\*\*|_[\s\S]*?_|R\/)/
  )

  return parts.map((part, i) => {
    if (part === 'R/')
      return (
        <strong key={i} className="text-blue-600">
          R/{' '}
        </strong>
      )
    if (/^<strong>([\s\S]*?)<\/strong>$/.test(part)) {
      const inner = part.replace(/^<strong>|<\/strong>$/g, '')
      return <strong key={i}>{parseInline(inner)}</strong>
    }
    if (/^<em>([\s\S]*?)<\/em>$/.test(part)) {
      const inner = part.replace(/^<em>|<\/em>$/g, '')
      return <em key={i}>{parseInline(inner)}</em>
    }
    if (/^\*\*([\s\S]*?)\*\*$/.test(part)) {
      const inner = part.replace(/^\*\*|\*\*$/g, '')
      return <strong key={i}>{parseInline(inner)}</strong>
    }
    if (/^_([\s\S]*?)_$/.test(part)) {
      const inner = part.replace(/^_|_$/g, '')
      return <em key={i}>{parseInline(inner)}</em>
    }
    if (/<br\s?\/?>/.test(part)) return <br key={i} />
    return part
  })
}

function parseContent(text: string): React.ReactNode {
  if (!text) return null

  const cleaned = text.replace(/<p>/g, '\n').replace(/<\/p>/g, '\n').trim()
  const paragraphs = cleaned.split(/\n{2,}/).filter(Boolean)

  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="mb-4">
          {parseInline(paragraph.trim())}
        </p>
      ))}
    </>
  )
}

function ReadingCard({ lecture, multiMass = false }: { lecture: Reading; multiMass?: boolean }) {
  return (
    <Card className="pt-0 shadow-md">
      <CardHeader className="bg-blue-50 px-6 py-4 border-b ">
        {getReadingTypeLabel(lecture.type) && (
          <CardTitle className="text-xl font-semibold mb-4 text-blue-800">
            {getReadingTypeLabel(lecture.type)}
          </CardTitle>
        )}
        <CardDescription>
          {lecture.titre && (
            <h4 className="text-base font-semibold italic text-blue-500">{lecture.titre}</h4>
          )}
          <p className={`text-blue-600 text-sm mt-1 ${!multiMass ? 'text-right' : ''}`}>
            {lecture.ref}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {!multiMass && lecture.refrain_psalmique && (
          <Typography className="mb-4">
            <strong>R/</strong>{' '}
            {parseInline(lecture.refrain_psalmique.replace(/<\/?p>/g, '').trim())}
          </Typography>
        )}
        {!multiMass && lecture.verset_evangile && (
          <div>{parseContent(lecture.verset_evangile)}</div>
        )}
        <Typography>{parseContent(lecture.contenu)}</Typography>
      </CardContent>
    </Card>
  )
}

export default function DailyReadingsPage() {
  const { isLoading, data, error, refetch } = useQuery<ReadingsResponse>({
    queryKey: ['daily-readings', new Date().toDateString()],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0]
      const response = await fetch(`https://api.aelf.org/v1/messes/${today}`)
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`)
      return response.json()
    },
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  const liturgicalHeader = useMemo(
    () => (data ? getLiturgicalHeader(data.informations) : null),
    [data]
  )

  return (
    <>
      <Head title="Lectures du jour" />

      <Container size="content" className="my-40 space-y-10">
        <Typography variant="h1">Lectures du jour</Typography>

        {data?.informations && liturgicalHeader && (
          <div className="space-y-1 mt-2">
            <div>
              <div className="flex items-center space-x-2">
                <span
                  className="w-4 h-4 rounded-sm border border-gray-600"
                  style={{ backgroundColor: liturgicalColor(liturgicalHeader.couleur) }}
                />
                <span className="text-gray-700 font-bold">
                  {liturgicalHeader.dateInfo.weekday}, {liturgicalHeader.dateInfo.semaine || ''} —
                  Année {liturgicalHeader.dateInfo.annee}
                </span>
              </div>
              {liturgicalHeader.mainName && (
                <div className="flex space-x-2">
                  <span className="w-4 h-4" />
                  <span>{liturgicalHeader.mainName}</span>
                </div>
              )}
            </div>

            {liturgicalHeader.subFeast && (
              <div className="flex items-center space-x-2">
                {liturgicalHeader.couleur2 && (
                  <span
                    className="w-4 h-4 rounded-sm border shadow"
                    style={{ backgroundColor: liturgicalColor(liturgicalHeader.couleur2) }}
                  />
                )}
                <span className="text-gray-700">{liturgicalHeader.subFeast}</span>
              </div>
            )}

            {liturgicalHeader.subDegree && (
              <div className="text-gray-500">{liturgicalHeader.subDegree}</div>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <span className="ml-4 text-gray-600">Chargement des lectures...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">Erreur lors du chargement des lectures</p>
            <p className="text-red-500 text-sm mt-2">{(error as Error).message}</p>
            <Button onClick={() => refetch()} variant="destructive" className="mt-4">
              Réessayer
            </Button>
          </div>
        )}

        {data && (
          <div className="space-y-8">
            {data.messes.length > 1
              ? data.messes.map((mass, index) => (
                  <div key={index} className="space-y-4">
                    <h2 className="text-2xl font-bold text-blue-700">{mass.nom}</h2>
                    {sortReadings(mass.lectures).map((lecture) => (
                      <ReadingCard key={lecture.type} lecture={lecture} multiMass />
                    ))}
                  </div>
                ))
              : sortReadings(data.messes[0].lectures).map((lecture) => (
                  <ReadingCard key={lecture.type} lecture={lecture} />
                ))}

            {(data.messes.length === 0 || data.messes[0].lectures.length === 0) && (
              <div className="text-center py-12">
                <Typography className="text-gray-500">
                  Aucune lecture disponible pour aujourd'hui.
                </Typography>
              </div>
            )}
          </div>
        )}
      </Container>
    </>
  )
}
