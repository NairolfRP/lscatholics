import { createFileRoute } from '@tanstack/react-router'
import { parishes } from '#/config/parishes.ts'
import { ParishesExplorer } from '#/features/parishes/components/parishes-explorer'
import { pageMetadata } from '#/utils/seo.ts'
import Hero from '#shared/layouts/app/components/hero.tsx'

export const Route = createFileRoute('/_app/parishes')({
  head: () => ({
    meta: pageMetadata('Nos Paroisses', {
      metadata: {
        description: "Découvrez les communautés de foi qui composent l'archidiocèse de Los Santos.",
      },
    }),
  }),
  component: ParishesPage,
})

function ParishesPage() {
  return (
    <>
      <Hero
        variant="minimal"
        title="Nos Paroisses"
        backgroundColor="bg-linear-to-r from-catholic-purple to-catholic-blue"
        subtitle="Découvrez les communautés de foi qui composent l'archidiocèse de Los Santos."
      />

      <section className="container mx-auto max-w-7xl px-4 pt-15 pb-20 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Les paroisses de l'archidiocèse de Los Santos vous accueillent pour les célébrations,
            les sacrements et la vie de quartier. Sélectionnez une paroisse pour la localiser sur la
            carte.
          </p>
        </header>

        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border pb-6 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{parishes.length} paroisses</span>
          <span aria-hidden className="text-border">
            ·
          </span>
          <span>Doyenné Notre-Dame-des-Saints</span>
        </div>

        <ParishesExplorer />
      </section>
    </>
  )
}
