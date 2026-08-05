import { BookOpenTextIcon, Music2Icon, SparklesIcon } from 'lucide-react'
import type { AELFReading, AELFReadingType } from '#/features/daily-readings/types/aelf.types.ts'
import { getReadingTypeLabel } from '#/features/daily-readings/utils/readings.utils.ts'
import { Card, CardContent, CardHeader } from '#/shared/components/ui/card.tsx'
import { ReadingContent } from './reading-content.tsx'

const TYPE_ICONS: Partial<Record<AELFReadingType, typeof BookOpenTextIcon>> = {
  lecture_1: BookOpenTextIcon,
  lecture_2: BookOpenTextIcon,
  psaume: Music2Icon,
  cantique: Music2Icon,
  evangile: SparklesIcon,
}

export function ReadingCard({
  reading,
  id,
  headingLevel = 3,
}: {
  reading: AELFReading
  id: string
  headingLevel?: 3 | 4
}) {
  const type = reading.type as AELFReadingType
  const label = getReadingTypeLabel(type)
  const Icon = TYPE_ICONS[type] ?? BookOpenTextIcon
  const isPsalm = type === 'psaume' || type === 'cantique'
  const Heading = headingLevel === 4 ? 'h4' : 'h3'

  return (
    <article id={id} className="scroll-mt-32">
      <Card className="overflow-hidden pt-0">
        <CardHeader className="flex-row items-center justify-between gap-3 rounded-none border-b bg-muted/40 px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="size-4" />
            </span>
            {label && <Heading className="font-semibold">{label}</Heading>}
          </div>
          {reading.ref && (
            <span className="shrink-0 text-right font-medium text-muted-foreground">
              {reading.ref}
            </span>
          )}
        </CardHeader>

        <CardContent className="space-y-4 px-5 py-5">
          {reading.intro_lue && (
            <p className="text-sm font-semibold text-primary">{reading.intro_lue}</p>
          )}
          {reading.titre && <h4 className="font-medium italic">{reading.titre}</h4>}

          {isPsalm && reading.refrain_psalmique?.trim() && (
            <PsalmRefrain refrain={reading.refrain_psalmique} refRefrain={reading.ref_refrain} />
          )}

          {type === 'evangile' && reading.verset_evangile?.trim() && (
            <GospelAcclamation
              acclamation={reading.verset_evangile}
              refVerset={reading.ref_verset}
            />
          )}

          <ReadingContent html={reading.contenu} variant={isPsalm ? 'poetry' : 'prose'} />
        </CardContent>
      </Card>
    </article>
  )
}

function PsalmRefrain({ refrain, refRefrain }: { refrain: string; refRefrain: string | null }) {
  return (
    <blockquote className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
      <div className="flex items-baseline gap-2">
        <span aria-hidden className="font-bold text-primary">
          R/
        </span>
        <ReadingContent html={refrain} className="min-w-0 flex-1 [&>p]:text-pretty" />
      </div>
      {refRefrain && (
        <cite className="mt-1 block text-xs text-muted-foreground not-italic">{refRefrain}</cite>
      )}
    </blockquote>
  )
}

function GospelAcclamation({
  acclamation,
  refVerset,
}: {
  acclamation: string
  refVerset: string | null
}) {
  return (
    <div className="rounded-lg border border-catholic-gold/30 bg-catholic-gold/5 px-4 py-3">
      <p className="mb-1 text-xs font-semibold tracking-[0.2em] text-catholic-gold uppercase">
        Acclamation de l'Évangile
      </p>
      <ReadingContent html={acclamation} className="[&_strong]:text-catholic-gold" />
      {refVerset && (
        <cite className="mt-1 block text-xs text-muted-foreground not-italic">{refVerset}</cite>
      )}
    </div>
  )
}
