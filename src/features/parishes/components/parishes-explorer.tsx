import { useEffect, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import { CrossIcon, MapPinIcon, RotateCcwIcon } from 'lucide-react'
import { parishes } from '#/config/parishes'
import { MapFallback } from '#/shared/components/map/map-fallback'
import { useMediaQuery } from '#/shared/hooks/use-media-query'
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
  const chipsRef = useRef<HTMLElement | null>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    let cancelled = false

    void import('./parishes-map').then((module) => {
      if (!cancelled) setParishesMap(() => module.ParishesMap)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const centerChip = (id: ParishId) => {
    const nav = chipsRef.current
    const chip = nav?.querySelector<HTMLElement>(`[data-parish-chip="${id}"]`)
    if (!nav || !chip) return

    const delta =
      chip.getBoundingClientRect().left -
      nav.getBoundingClientRect().left -
      (nav.clientWidth - chip.offsetWidth) / 2

    nav.scrollTo({ left: nav.scrollLeft + delta, behavior: 'smooth' })
  }

  const selectParish = (id: ParishId | null) => {
    const next = id == null || activeParishId === id ? null : id
    setActiveParishId(next)

    if (!next) return

    centerChip(next)

    if (isDesktop) {
      requestAnimationFrame(() => {
        listRef.current
          ?.querySelector(`[data-parish-id="${next}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-5 lg:gap-8">
      <div className="sticky top-[calc(5rem+var(--twsa-safe-area-inset-top))] z-30 -mx-4 bg-background px-4 pt-2 pb-3 lg:top-[calc(var(--header-height)+1.25rem)] lg:col-span-3 lg:mx-0 lg:self-start lg:bg-transparent lg:p-0">
        <div className="relative h-[min(40svh,320px)] min-h-[220px] lg:h-[calc(100svh-var(--header-height)-7rem)] lg:max-h-[720px] lg:min-h-[560px]">
          {ParishesMap ? (
            <ParishesMap activeParishId={activeParishId} onSelectParish={selectParish} />
          ) : (
            <MapFallback className="h-full rounded-2xl" />
          )}
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground lg:mt-3">
          <MapPinIcon className="size-3.5 shrink-0" />
          Cliquez sur une carte pour la découvrir, ou sur une paroisse pour la localiser.
        </p>

        <nav
          ref={chipsRef}
          aria-label="Sélection rapide d'une paroisse"
          className="-mx-4 mt-2 flex snap-x scroll-px-4 gap-2 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_1rem,black_calc(100%_-_1rem),transparent)] px-4 pb-1 lg:hidden"
        >
          {parishes.map((parish) => (
            <button
              key={parish.id}
              type="button"
              data-parish-chip={parish.id}
              aria-pressed={activeParishId === parish.id}
              onClick={() => selectParish(parish.id)}
              className={cn(
                'shrink-0 snap-start rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition',
                activeParishId === parish.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-foreground/15 bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
              )}
            >
              {parish.title}
            </button>
          ))}
        </nav>
      </div>

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
