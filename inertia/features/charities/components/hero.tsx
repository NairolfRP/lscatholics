import { Button } from '@/shared/components/ui/button'
import { ArrowRight } from 'lucide-react'
import HeroImage from '@/assets/images/TKKU0.webp'
import { Link } from '@adonisjs/inertia/react'

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-end overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${HeroImage})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A0A0E] via-[#1A0A0E]/70 to-[#1A0A0E]/20" />

      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      <div className="z-10 max-w-6xl mx-auto px-6 pb-24 w-full">
        <h1
          className="text-white mb-6 leading-[0.95]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            fontWeight: 300,
          }}
        >
          Catholic
          <br />
          <em className="text-primary not-italic" style={{ fontWeight: 600 }}>
            Charities
          </em>
        </h1>

        <p
          className="text-white/70 max-w-lg text-lg leading-relaxed mb-10"
          style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 300 }}
        >
          Inspirés par l'Évangile, nous servons toute personne dans le besoin — quelle que soit sa
          foi, son origine ou sa situation.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link route="donate.index">
            <Button variant="default" className="px-8 py-6 text-sm tracking-widest uppercase">
              Faire un don <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#programmes">
            <Button
              variant="outline"
              className="border-foreground/30 hover:bg-background/85 rounded-none px-8 py-6 text-sm tracking-widest uppercase"
            >
              Nos programmes
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
