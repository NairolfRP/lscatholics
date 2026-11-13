import type { LucideIcon } from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import { Calendar, HandHeart, Home, MoreHorizontal, Newspaper } from 'lucide-react'
import { cn } from '#/shared/lib/utils'

type BottomNavItem = {
  label: string
  to: string
  icon: LucideIcon
  highlight?: boolean
}

const items: BottomNavItem[] = [
  { label: 'Accueil', to: '/', icon: Home },
  { label: 'Actualités', to: '/newsroom', icon: Newspaper },
  { label: 'Événements', to: '/events', icon: Calendar },
  { label: 'Donner', to: '/donate', icon: HandHeart, highlight: true },
]

export function BottomNavigation({ open, onOpenMenu }: { open: boolean; onOpenMenu: () => void }) {
  const { pathname } = useLocation()

  if (open) {
    return null
  }

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-safe pb-safe backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden"
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-2">
        {items.map((item) => {
          const active = pathname === item.to || pathname.startsWith(`${item.to}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 rounded-md text-[0.65rem] font-medium text-muted-foreground transition-colors',
                active && 'text-primary',
                item.highlight &&
                  'bg-secondary font-semibold text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          )
        })}

        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Ouvrir le menu de navigation"
          className="flex flex-1 flex-col items-center justify-center gap-1 rounded-md text-[0.65rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <MoreHorizontal className="size-5" aria-hidden="true" />
          <span>Plus</span>
        </button>
      </div>
    </nav>
  )
}
