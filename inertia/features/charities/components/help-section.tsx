import { HELP_CARDS } from '@/features/charities/constants/charities.constants'
import { Ornament } from '@/features/charities/components/ornament'
import { ArrowRight, HandHeart } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Link } from '@adonisjs/inertia/react'

export function HelpSection() {
  return (
    <section className="bg-background py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p
            className="text-secondary text-sm uppercase tracking-[0.3em] mb-3"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Ensemble
          </p>
          <h2
            className="text-foreground"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 400,
            }}
          >
            Comment <em className="text-primary font-bold">participer</em>
          </h2>
          <Ornament />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {HELP_CARDS.map((helpCard) => (
            <div
              key={helpCard.title}
              className="bg-background border border-secondary/20 overflow-hidden flex flex-col"
            >
              <div className={`${helpCard.accent} h-1.5`} />
              <div className="p-8 flex flex-col flex-1 gap-4">
                <HandHeart className="h-6 w-6 text-primary" />
                <h3
                  className="text-primary text-2xl font-bold"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {helpCard.title}
                </h3>
                <p
                  className="text-foreground/70 text-sm leading-relaxed flex-1"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  {helpCard.body}
                </p>

                {helpCard?.route ? (
                  <Link route={helpCard.route as any} routeParams={helpCard.routeParams}>
                    <Button
                      variant="default"
                      className="w-full tracking-widest uppercase text-xs mt-2"
                    >
                      {helpCard.cta} <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                ) : (
                  <a href={helpCard.href ?? '#'}>
                    <Button
                      variant="default"
                      className="w-full tracking-widest uppercase text-xs mt-2"
                    >
                      {helpCard.cta} <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
