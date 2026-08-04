import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import type { Program } from '#/features/catholic-charities/types/charities.types'
import { Badge } from '#shared/components/ui/badge'

export function ProgramCard({ program }: { program: Program }) {
  const Icon = program.icon
  return (
    <Link
      to="/charities/program/$slug"
      params={{ slug: program.slug }}
      className="group flex h-full flex-col rounded-2xl bg-muted p-8 ring-1 ring-foreground/10 transition hover:-translate-y-1 hover:shadow-xl hover:ring-catholic-red/40"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-catholic-red/10 text-catholic-red transition group-hover:bg-catholic-red group-hover:text-white dark:text-red-400">
          <Icon className="size-6" />
        </span>
        <ArrowRightIcon className="size-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-catholic-red" />
      </div>
      <Badge
        variant="outline"
        className="mt-6 w-fit text-[10px] tracking-widest text-catholic-red uppercase dark:border-red-400/40 dark:text-red-400"
      >
        {program.tag}
      </Badge>
      <h3 className="mt-4 text-xl font-bold text-foreground">{program.title}</h3>
      <p className="mt-3 leading-relaxed text-muted-foreground">{program.description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-catholic-red uppercase dark:text-red-400">
        En savoir plus
        <ArrowRightIcon className="size-3.5" />
      </span>
    </Link>
  )
}
