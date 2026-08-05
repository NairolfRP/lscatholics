import type { AELFReadingsMetadata } from '#/features/daily-readings/types/aelf.types.ts'
import {
  getLiturgicalColorHex,
  getLiturgicalColorName,
  getLiturgicalHeader,
} from '#/features/daily-readings/utils/readings.utils.ts'
import { Badge } from '#/shared/components/ui/badge.tsx'

export function ReadingsHeader({ info }: { info: AELFReadingsMetadata }) {
  const header = getLiturgicalHeader(info)

  const primaryHex = getLiturgicalColorHex(header.couleur)
  const primaryName = getLiturgicalColorName(header.couleur)

  return (
    <section className="relative overflow-hidden rounded-2xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
      {primaryHex && (
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-1.5"
          style={{ backgroundColor: primaryHex }}
        />
      )}

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold tracking-[0.25em] text-muted-foreground uppercase">
            {header.weekday} {header.formattedDate}
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{header.mainName}</h2>

          {header.subLines.length > 0 && (
            <div className="flex flex-col items-start gap-1.5">
              {header.subLines.map((line) => (
                <span
                  key={line.label}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                >
                  <ColorDot hex={getLiturgicalColorHex(line.color)} />
                  {line.label}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {header.semaine && header.semaine !== header.mainName && (
              <Badge variant="secondary">{header.semaine}</Badge>
            )}
            {header.annee && <Badge variant="outline">Année {header.annee}</Badge>}
          </div>
        </div>

        {primaryHex && primaryName && <ColorChip hex={primaryHex} name={primaryName} />}
      </div>
    </section>
  )
}

function ColorDot({ hex }: { hex: string | null }) {
  if (!hex) return null
  return (
    <span
      aria-hidden
      className="size-2.5 shrink-0 rounded-full ring-1 ring-black/20"
      style={{ backgroundColor: hex }}
    />
  )
}

function ColorChip({ hex, name }: { hex: string; name: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-foreground/10">
      <span
        aria-hidden
        className="size-3 rounded-full ring-1 ring-black/20"
        style={{ backgroundColor: hex }}
      />
      {name}
    </span>
  )
}
