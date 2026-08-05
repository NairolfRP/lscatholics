import { ExternalLinkIcon, ListIcon } from 'lucide-react'
import type { AELFMass } from '#/features/daily-readings/types/aelf.types.ts'
import {
  getReadingTypeLabel,
  sortReadings,
} from '#/features/daily-readings/utils/readings.utils.ts'
import { socials } from '#/shared/constants/socials.ts'

export function ReadingsSidebar({ messes }: { messes: AELFMass[] }) {
  return (
    <div className="space-y-6 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
      <SourceCard />

      <ContentsCard messes={messes} />
    </div>
  )
}

function SourceCard() {
  return (
    <div className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10 lg:shrink-0">
      <h2 className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">Source</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        (( Les lectures du jour sont fournies par l'AELF (
        <a
          href="https://www.aelf.org"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          aelf.org
          <ExternalLinkIcon className="size-3.5" />
        </a>
        ), une source francophone : les célébrations propres aux diocèses des États-Unis n'y
        figurent donc pas. Pour les jours particuliers étasuniens, consultez nos guides sur{' '}
        <a
          href={socials.discord.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Discord
        </a>
        . ))
      </p>
    </div>
  )
}

function ContentsCard({ messes }: { messes: AELFMass[] }) {
  const multiMass = messes.length > 1

  return (
    <nav
      aria-label="Sommaire des lectures"
      className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden"
    >
      <h2 className="flex shrink-0 items-center gap-2 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
        <ListIcon className="size-4" />
        Dans cette page
      </h2>

      <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto">
        {multiMass ? (
          messes.map((mass, massIndex) => (
            <section key={massIndex}>
              <h3 className="mb-2 text-sm font-bold">{mass.nom}</h3>
              <ul className="space-y-1">
                {sortReadings(mass.lectures).map((reading, readingIndex) => (
                  <ContentsLink
                    key={`lecture-${massIndex}-${readingIndex}`}
                    id={`lecture-${massIndex}-${readingIndex}`}
                    label={getReadingTypeLabel(reading.type) ?? reading.type}
                    ref={reading.ref}
                  />
                ))}
              </ul>
            </section>
          ))
        ) : (
          <ul className="space-y-1">
            {sortReadings(messes[0].lectures).map((reading, readingIndex) => (
              <ContentsLink
                key={`lecture-0-${readingIndex}`}
                id={`lecture-0-${readingIndex}`}
                label={getReadingTypeLabel(reading.type) ?? reading.type}
                ref={reading.ref}
              />
            ))}
          </ul>
        )}
      </div>
    </nav>
  )
}

function ContentsLink({ id, label, ref }: { id: string; label: string; ref: string }) {
  return (
    <li>
      <a
        href={`#${id}`}
        className="group flex items-baseline justify-between gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span className="font-semibold group-hover:text-primary">{label}</span>
        <span className="shrink-0 text-xs text-muted-foreground">{ref}</span>
      </a>
    </li>
  )
}
