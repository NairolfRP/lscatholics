import { Head } from '@inertiajs/react'
import { lazy, startTransition, Suspense, useRef } from 'react'
import { MapPin } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Typography } from '@/shared/components/ui/typography'
import { parishes } from '@/shared/constants/parishes.constants'
import HeroSection from '@/shared/components/layout/default/hero-section'
import type { MapMarkerHandle } from '@/shared/components/map/map-marker'
import type { GTA5MapHandle } from '@/shared/components/map/gta5-map'
import { MapFallback } from '@/shared/components/map/map-fallback'
import { Container } from '@/shared/components/ui/container'

const ParishesMap = lazy(() => import('@/features/parishes/components/parishes-map'))

export default function ParishesPage() {
  const mapScrollTarget = useRef<HTMLDivElement>(null)
  const mapRef = useRef<GTA5MapHandle>(null)
  const markerRefs = useRef<Array<MapMarkerHandle | null>>([])

  const focusParish = (index: number) => {
    startTransition(() => {
      const parish = parishes[index]

      if (mapScrollTarget.current) {
        startTransition(() => {
          mapScrollTarget.current!.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
      }

      if (mapRef.current) {
        startTransition(() => {
          mapRef.current!.flyTo(parish.coords as [number, number], 5)
        })
      }

      setTimeout(() => {
        const marker = markerRefs.current[index]
        if (marker) marker.openPopup()
      }, 600)
    })
  }

  return (
    <>
      <Head title="Nos Paroisses" />

      <HeroSection
        bgColor="bg-linear-to-r from-catholic-purple to-catholic-blue"
        textColor="text-white"
        py="16"
      >
        <Typography
          variant="h2"
          className="border-none text-inherit text-4xl md:text-5xl font-bold mb-4"
        >
          Nos Paroisses
        </Typography>
        <Typography className="text-inherit text-xl opacity-90">
          Découvrez les communautés de foi qui composent notre archidiocèse
        </Typography>
      </HeroSection>

      <Container spacing="md">
        <div className="container max-w-7xl mx-auto px-4">
          <Typography variant="h2" className="pb-10 text-catholic-purple font-bold">
            Doyenné Notre-Dame-des-Saints
          </Typography>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {parishes.map((parish, index) => (
              <Card
                key={parish.id}
                onClick={() => focusParish(index)}
                className="card-hover cursor-pointer transition-all hover:ring-2 hover-ring-catholic-gold pt-0"
              >
                {parish.image ? (
                  <div
                    className="aspect-video bg-cover bg-center"
                    style={{ backgroundImage: `url(${parish.image})` }}
                  />
                ) : (
                  <div className="aspect-video bg-gray-200 rounded-t-lg" />
                )}
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-catholic-purple">{parish.name}</h3>
                  <div className="flex items-start gap-2 mb-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{parish.address}</span>
                  </div>
                  {parish.description && (
                    <p className="text-base text-justify leading-7 py-2">{parish.description}</p>
                  )}
                  <div className="mb-4">
                    <h4 className="inline font-semibold mb-2 text-sm">{parish.priestOffice} :</h4>
                    <div className="inline ml-2 space-y-1 text-xs">{parish.priestName}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div ref={mapScrollTarget} className="mt-12">
            <Suspense fallback={<MapFallback />}>
              <ParishesMap mapRef={mapRef} markerRefs={markerRefs} />
            </Suspense>
          </div>
        </div>
      </Container>
    </>
  )
}
