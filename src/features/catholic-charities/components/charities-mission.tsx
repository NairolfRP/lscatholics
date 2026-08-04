import { Ornament } from './ornament'

export function CharitiesMission() {
  return (
    <section className="bg-zinc-950 py-24 text-center md:py-32">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase">
          Notre mission
        </p>
        <Ornament className="mt-6 text-amber-400" />
        <blockquote className="mt-8 text-2xl leading-relaxed text-balance text-white md:text-3xl">
          « Ce que vous avez fait à l'un de ces plus petits de mes frères, c'est à moi que vous
          l'avez fait »
        </blockquote>
        <cite className="mt-4 block text-sm font-bold tracking-widest text-amber-400 uppercase not-italic">
          — Matthieu 25:40
        </cite>
        <p className="mx-auto mt-10 max-w-2xl text-lg/relaxed text-white/70">
          Catholic Charities de l'Archidiocèse de Los Santos accompagne depuis 1919 les personnes
          vulnérables des comtés de Los Santos, Ventura et Santa Barbara. Enracinés dans la doctrine
          sociale de l'Église, nous agissons pour la dignité humaine, la justice et la solidarité —
          au-delà de toute frontière confessionnelle.
        </p>
      </div>
    </section>
  )
}
