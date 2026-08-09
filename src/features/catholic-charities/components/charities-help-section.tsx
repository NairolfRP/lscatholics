import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import { helpCards } from '#/features/catholic-charities/constants/charities.constants'
import { buttonVariants } from '#shared/components/ui/button'
import { cn } from '#shared/lib/utils'
import { Ornament } from './ornament'

export function CharitiesHelpSection() {
  return (
    <section id="participer" className="scroll-mt-(--header-height) bg-muted py-24 md:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-catholic-red uppercase dark:text-red-400">
            Ensemble
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
            Comment <span className="text-catholic-red dark:text-red-400">participer</span>
          </h2>
          <Ornament className="mt-6 text-catholic-red dark:text-red-400" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {helpCards.map(({ icon: Icon, title, body, cta, to, hash, accent }) => (
            <article
              key={title}
              className="flex flex-col overflow-hidden rounded-2xl bg-background ring-1 ring-foreground/10 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={cn('h-1.5', accent)} />
              <div className="flex flex-1 flex-col gap-4 p-8">
                <span className="flex size-12 items-center justify-center rounded-full bg-catholic-red/10 text-catholic-red dark:text-red-400">
                  <Icon className="size-6" />
                </span>
                <h3 className="text-2xl font-bold text-foreground">{title}</h3>
                <p className="flex-1 leading-relaxed text-muted-foreground">{body}</p>
                <Link
                  to={to}
                  hash={hash}
                  activeOptions={{ includeHash: !!hash?.length }}
                  className={buttonVariants({ className: 'mt-2 w-full gap-2 uppercase' })}
                >
                  {cta}
                  <ArrowRightIcon className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
