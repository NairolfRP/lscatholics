import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useRef } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { HandHeart } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/shared/components/ui/accordion'
import { buttonVariants } from '#/shared/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '#/shared/components/ui/navigation-menu'
import { cn } from '#/shared/lib/utils'
import type { NavItem } from '#/shared/types/nav.types'
import { navItems } from '../constants/nav.constants'

type GridRow = (typeof VALID_ROWS)[number]

const VALID_ROWS = [1, 2, 3, 4, 5, 6] as const

const GRID_CONFIG = {
  BASE_CLASSES: 'gap-3 p-6 grid w-[48rem]',
  SMALL_THRESHOLD: 4,
  MEDIUM_THRESHOLD: 6,
  COLUMNS: 3,
  GRID_ROWS: {
    1: 'grid-rows-1',
    2: 'grid-rows-2',
    3: 'grid-rows-3',
    4: 'grid-rows-4',
    5: 'grid-rows-5',
    6: 'grid-rows-6',
  },
} as const

const triggerButtonClasses = cn(
  navigationMenuTriggerStyle(),
  'nav-trigger-button',
  'bg-transparent pb-0 text-sm font-black uppercase transition-colors duration-200 ease-in-out'
)

const getRelAttribute = (item: NavItem): string | undefined =>
  item.target === '_blank' ? 'noopener noreferrer' : undefined

const clampToGridRow = (n: number): GridRow => {
  const clamped = Math.max(1, Math.min(n, 6))
  return clamped as GridRow
}

const getSubmenuClasses = (count: number): string => {
  if (count <= 0 || count <= GRID_CONFIG.SMALL_THRESHOLD) {
    return GRID_CONFIG.BASE_CLASSES
  }

  if (count <= GRID_CONFIG.MEDIUM_THRESHOLD) {
    return `${GRID_CONFIG.BASE_CLASSES} grid-flow-col ${GRID_CONFIG.GRID_ROWS[4]}`
  }

  const rows = clampToGridRow(Math.ceil(count / GRID_CONFIG.COLUMNS))

  return `${GRID_CONFIG.BASE_CLASSES} grid-flow-col ${GRID_CONFIG.GRID_ROWS[rows]}`
}

const isPathActive = (to: string, pathname: string): boolean =>
  pathname === to || pathname.startsWith(`${to}/`)

const isNavItemActive = (item: NavItem, pathname: string): boolean => {
  if (item.children?.some((child) => child.to && isPathActive(child.to, pathname))) {
    return true
  }

  return item.to ? isPathActive(item.to, pathname) : false
}

export default function Navigation() {
  const listRef = useRef<HTMLUListElement>(null)
  const { pathname } = useLocation()

  return (
    <NavigationMenu
      className="z-40 hidden w-full justify-end leading-none uppercase min-[65.875rem]:flex"
      role="navigation"
      aria-label="Navigation principale"
      anchor={listRef}
      disableAnchorTracking
    >
      <NavigationMenuList ref={listRef}>
        {navItems.map((item) => {
          const active = isNavItemActive(item, pathname)

          return (
            <NavigationMenuItem key={item.label}>
              {item.children ? (
                <>
                  <NavigationMenuTrigger
                    className={cn(triggerButtonClasses, active && 'text-catholic-gold')}
                  >
                    {item.label}
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <ul className={getSubmenuClasses(item.children.length)}>
                      {item.children.map((subItem) =>
                        subItem.to ? (
                          <li key={subItem.label}>
                            <NavigationMenuLink
                              className={triggerButtonClasses}
                              closeOnClick
                              render={
                                <Link
                                  to={subItem.to}
                                  params={subItem.params}
                                  aria-current={isPathActive(subItem.to, pathname) ? 'page' : undefined}
                                  className="group block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-transparent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                />
                              }
                            >
                              <div
                                className={cn(
                                  'text-sm leading-none font-medium transition-colors group-hover:text-catholic-gold',
                                  isPathActive(subItem.to, pathname) && 'text-catholic-gold'
                                )}
                              >
                                {subItem.label}
                              </div>
                            </NavigationMenuLink>
                          </li>
                        ) : null
                      )}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : item.to ? (
                <NavigationMenuLink
                  className={cn(triggerButtonClasses, active && 'text-catholic-gold')}
                  render={
                    <Link
                      to={item.to}
                      params={item.params}
                      target={item.target}
                      rel={getRelAttribute(item)}
                      aria-current={active ? 'page' : undefined}
                    />
                  }
                >
                  {item.label}
                </NavigationMenuLink>
              ) : (
                <NavigationMenuLink>{item.label}</NavigationMenuLink>
              )}
            </NavigationMenuItem>
          )
        })}

        <NavigationMenuItem>
          <Link
            to="/donate"
            className={cn(
              buttonVariants({
                variant: 'secondary',
              }),
              'py-5 font-bold hover:bg-primary'
            )}
            aria-label="Faire un don"
          >
            <HandHeart aria-hidden="true" />
            Donner
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export function MobileNavigation({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const activeParentLabel = navItems.find(
    (item) => item.children?.some((child) => child.to && isPathActive(child.to, pathname))
  )?.label

  useEffect(() => {
    if (!open) {
      return
    }

    document.body.dataset.scrollLocked = 'true'

    const previouslyFocused = document.activeElement as HTMLElement | null
    const firstFocusable = containerRef.current?.querySelector<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      delete document.body.dataset.scrollLocked
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [open, setOpen])

  useEffect(() => {
    setOpen(false)
  }, [pathname, setOpen])

  if (!open) {
    return null
  }

  return (
    <div
      ref={containerRef}
      id="mobile-navigation"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navigation"
      className="pointer-events-auto fixed inset-0 z-30 overflow-y-auto bg-primary px-6 pt-40 text-primary-foreground opacity-100 transition-all duration-300 min-[65.875rem]:hidden"
    >
      <nav className="flex flex-col items-center gap-4 p-4">
        <Accordion
          className="w-full gap-5"
          defaultValue={activeParentLabel ? [activeParentLabel] : undefined}
        >
          {navItems.map((item) => (
            <SiteMobileNavigationItem key={item.label} item={item} onClose={() => setOpen(false)} />
          ))}
        </Accordion>

        <Link
          to="/donate"
          onClick={() => setOpen(false)}
          className={cn(
            buttonVariants({
              variant: 'secondary',
            }),
            'mt-5 w-1/2 py-7 text-lg font-bold'
          )}
          aria-label="Faire un don"
        >
          <HandHeart aria-hidden="true" className="size-5" />
          Faire un don
        </Link>
      </nav>
    </div>
  )
}

const mobileNavigationLinkClasses = 'block py-2 px-3 text-lg'

function SiteMobileNavigationItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const { pathname } = useLocation()
  const active = isNavItemActive(item, pathname)

  if (Array.isArray(item.children) && item.children.length > 0) {
    return (
      <AccordionItem value={item.label} className="border-none">
        <AccordionTrigger
          className={cn(
            'px-3 py-2 text-lg font-bold uppercase hover:cursor-pointer hover:no-underline **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:text-primary-foreground',
            active && 'text-catholic-gold'
          )}
        >
          {item.label}
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 pb-0 pl-3 [&_a]:no-underline [&_a]:hover:bg-secondary [&_a]:hover:text-primary-foreground">
          {item.children.map((child) => {
            const childActive = child.to ? isPathActive(child.to, pathname) : false

            return (
              <Link
                key={child.label}
                to={child.to}
                target={child.target}
                onClick={onClose}
                aria-current={childActive ? 'page' : undefined}
                className={cn(
                  mobileNavigationLinkClasses,
                  childActive && 'font-semibold text-catholic-gold'
                )}
              >
                {child.label}
              </Link>
            )
          })}
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <Link
      to={item.to}
      onClick={onClose}
      target={item.target}
      aria-current={active ? 'page' : undefined}
      className={cn(mobileNavigationLinkClasses, 'font-bold uppercase', active && 'text-catholic-gold')}
    >
      {item.label}
    </Link>
  )
}
