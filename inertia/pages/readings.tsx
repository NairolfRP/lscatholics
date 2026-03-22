import { useQuery } from '@tanstack/react-query'
import Head from '@/shared/components/app-head'
import { Typography } from '@/shared/components/ui/typography'
import { Button } from '@/shared/components/ui/button'
import { liturgicalColor } from '@/shared/services/liturgy'
import { Container } from '@/shared/components/ui/container'
import type { AELFReadingsResponse } from '@/features/readings/types/readings.types'
import { ReadingCard } from '@/features/readings/components/reading-card'
import { getLiturgicalHeader, sortReadings } from '@/features/readings/services/readings_service'

export default function DailyReadingsPage() {
  const { isLoading, data, error, refetch } = useQuery<AELFReadingsResponse>({
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

  const liturgicalHeader = data ? getLiturgicalHeader(data.informations) : null

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
