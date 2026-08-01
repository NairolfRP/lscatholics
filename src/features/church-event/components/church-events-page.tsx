import {
  ChurchEventsMonthList,
} from '#/features/church-event/components/church-events-month-list.tsx'
import Hero from '#shared/layouts/app/components/hero.tsx'

export function ChurchEventsPage() {
  return (
    <>
      <Hero
        variant="minimal"
        backgroundColor="bg-linear-to-r from-primary to-catholic-gold"
        title="Événements"
        subtitle="Consultez les événements et les activités à venir dans notre archidiocèse"
      />
      <section className="container mx-auto max-w-7xl space-y-2 px-2 pt-10 pb-20">
        <ChurchEventsMonthList />
      </section>
    </>
  )
}
