import { useEffect, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import { CrossIcon, MapPinIcon, RotateCcwIcon } from 'lucide-react'
import { parishes } from '#/config/parishes'
import { MapFallback } from '#/shared/components/map/map-fallback'
import { cn } from '#/shared/lib/utils'
import type { ParishId, ParishInfo } from '#/shared/types/parish.types'

type ParishesMapProps = {
  activeParishId: ParishId | null
  onSelectParish: (id: ParishId | null) => void
}

/**
 * Interactive "carte + liste" explorer.
 *
 * Leaflet only runs in the browser, so the map module is loaded lazily after
 * hydration; the cards and selection state render on the server.
 */
export function ParishesExplorer() {
  const [activeParishId, setActiveParishId] = useState<ParishId | null>(null)
  const [ParishesMap, setParishesMap] = useState<ComponentType<ParishesMapProps> | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cancelled = false

    void import('./parishes-map').then((module) => {
      if (!cancelled) setParishesMap(() => module.ParishesMap)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const selectParish = (id: ParishId | null) => {
    setActiveParishId((current) => {
      const next = id == null || current === id ? null : id

      if (next) {
        requestAnimationFrame(() => {
          listRef.current
            ?.querySelector(`[data-parish-id="${next}"]`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        })
      }

      return next
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
      <div className="lg:sticky lg:top-[calc(var(--header-height)+1.25rem)] lg:col-span-3 lg:self-start">
        <div className="relative h-[320px] sm:h-[420px] lg:h-[calc(100svh-var(--header-height)-7rem)] lg:max-h-[720px] lg:min-h-[560px]">
          {ParishesMap ? (
            <ParishesMap activeParishId={activeParishId} onSelectParish={selectParish} />
          ) : (
            <MapFallback className="h-full rounded-2xl" />
          )}
        </div>

        <p className="mt-3 hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex">
          <MapPinIcon className="size-3.5" />
          Cliquez sur une carte pour la découvrir, ou sur une paroisse pour la localiser.
        </p>
      </div>

      <nav
        aria-label="Sélection rapide d'une paroisse"
        className="col-span-5 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden"
      >
        {parishes.map((parish) => (
          <button
            key={parish.id}
            type="button"
            aria-pressed={activeParishId === parish.id}
            onClick={() => selectParish(parish.id)}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition',
              activeParishId === parish.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-foreground/15 bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
            )}
          >
            {parish.title}
          </button>
        ))}
      </nav>

      <div className="lg:col-span-2" ref={listRef}>
        <ol className="space-y-4">
          {parishes.map((parish) => (
            <li key={parish.id} data-parish-id={parish.id}>
              <ParishCard
                parish={parish}
                active={activeParishId === parish.id}
                onSelect={() => selectParish(parish.id)}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function ParishCard({
  parish,
  active,
  onSelect,
}: {
  parish: ParishInfo
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        'group relative flex w-full flex-col overflow-hidden rounded-2xl bg-card text-left transition',
        'ring-1',
        active
          ? 'shadow-lg ring-2 ring-primary'
          : 'ring-foreground/10 hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/40'
      )}
    >
      {parish.imageUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={parish.imageUrl}
            alt={parish.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            Doyenné Notre-Dame-des-Saints
          </span>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <h3 className="font-heading text-lg leading-snug font-bold text-foreground">
          {parish.title}
        </h3>

        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPinIcon className="mt-0.5 size-4 shrink-0" />
          <span>{parish.address}</span>
        </p>

        {parish.description ? (
          <p className="line-clamp-3 text-sm/relaxed text-muted-foreground">{parish.description}</p>
        ) : null}

        {parish.pastor ? (
          <p className="mt-auto flex items-center gap-2 border-t border-border pt-3 text-sm">
            <CrossIcon className="size-4 shrink-0 text-secondary" />
            <span className="font-semibold text-foreground">{parish.pastorOffice ?? 'Curé'} :</span>
            <span className="text-muted-foreground">{parish.pastor}</span>
          </p>
        ) : null}

        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          {active ? (
            <>
              <RotateCcwIcon className="size-4" /> Réinitialiser la vue
            </>
          ) : (
            <>Voir sur la carte</>
          )}
        </span>
      </div>
    </button>
  )
}
