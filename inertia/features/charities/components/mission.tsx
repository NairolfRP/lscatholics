import { Ornament } from '@/features/charities/components/ornament'
import { Separator } from '@/shared/components/ui/separator'

export function Mission() {
  return (
    <section className="bg-foreground text-background py-24 text-center">
      <div className="max-w-3xl mx-auto px-6">
        <p
          className="text-secondary text-sm uppercase tracking-[0.3em] mb-4"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Notre mission
        </p>
        <Ornament />
        <blockquote
          className="mt-8 leading-relaxed"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 400,
          }}
        >
          « Ce que vous avez fait à l’un de ces plus petits de mes frères, c’est à moi que vous
          l’avez fait »
        </blockquote>
        <cite
          className="block mt-4 text-primary/70 font-bold text-sm not-italic tracking-widest uppercase"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          — Matthieu 25:40
        </cite>
        <Separator className="my-7 bg-foreground/20" />
        <p
          className="text-background/80 text-base leading-relaxed"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Catholic Charities de l'Archidiocèse de Los Santos accompagne depuis 1919 les personnes
          vulnérables des comtés de Los Santos, Ventura et Santa Barbara. Enracinés dans la doctrine
          sociale de l'Église, nous agissons pour la dignité humaine, la justice et la solidarité —
          au-delà de toute frontière confessionnelle.
        </p>
      </div>
    </section>
  )
}
