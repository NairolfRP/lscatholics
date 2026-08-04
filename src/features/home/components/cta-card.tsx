import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { CTA } from '../types/home.types'

export function CTACard({ item: { icon: Icon, ...item } }: { item: CTA }) {
  const content = () => {
    return (
      <div className="group flex h-full flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/10 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-primary/40">
        {Icon && (
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="size-6" />
          </span>
        )}
        <div>
          <div className="font-bold leading-snug">{item.title}</div>
          {item.description && (
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          )}
        </div>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          En savoir plus
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    )
  }

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {content()}
      </a>
    )
  }

  return (
    <Link
      to={item.to}
      className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {content()}
    </Link>
  )
}
