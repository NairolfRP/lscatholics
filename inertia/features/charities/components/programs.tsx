import { ProgramCard } from '@/features/charities/components/program-card'
import { PROGRAMS } from '@/features/charities/constants/programs.constants'

export function Programs() {
  return (
    <section id="programmes" className="bg-[#FAFAF8] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <p
            className="text-secondary text-sm uppercase tracking-[0.3em] mb-3"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Ce que nous faisons
          </p>
          <h2
            className="text-foreground leading-tight font-medium"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            }}
          >
            Nos <em className="text-primary font-bold">programmes</em>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
          {PROGRAMS.map((p) => (
            <ProgramCard key={p.title} program={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
