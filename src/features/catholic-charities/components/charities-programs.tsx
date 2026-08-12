import { programs } from '#/features/catholic-charities/constants/programs.constants'
import { ProgramCard } from './program-card'

export function CharitiesPrograms() {
  return (
    <section id="programmes" className="scroll-mt-(--header-height) bg-background py-24 md:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-catholic-blue  uppercase ">
            Ce que nous faisons
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
            Nos <span className="text-catholic-blue">programmes</span>
          </h2>
          <p className="mt-6 text-lg/relaxed text-muted-foreground">
            Sept programmes concrets pour répondre aux urgences du quotidien et reconstruire
            l'autonomie des plus fragiles.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.slug} program={program} />
          ))}
        </div>
      </div>
    </section>
  )
}
