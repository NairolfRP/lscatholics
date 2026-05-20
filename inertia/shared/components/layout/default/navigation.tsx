import { HandHeart } from 'lucide-react'
import { Link } from '@adonisjs/inertia/react'
import { cn } from '@/lib/utils'
import { MENU_ITEMS, type MenuItem } from '@/shared/constants/menu.constants'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/shared/components/ui/navigation-menu'
import { Button } from '@/shared/components/ui/button'
import NavigationLink from '@/shared/components/layout/default/navigation-link'

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
  'bg-transparent text-primary-foreground font-black pb-0 uppercase text-sm laptop:text-base transition-colors duration-200 ease-in-out'
)

const hasLink = (item: MenuItem): boolean => Boolean(item.route || item.href)

const getRelAttribute = (item: MenuItem): string | undefined =>
  item.target === '_blank' ? 'noopener noreferrer' : undefined

const getSubmenuClasses = (count: number): string => {
  if (count <= 0 || count <= GRID_CONFIG.SMALL_THRESHOLD) {
    return GRID_CONFIG.BASE_CLASSES
  }

  if (count <= GRID_CONFIG.MEDIUM_THRESHOLD) {
    return `${GRID_CONFIG.BASE_CLASSES} grid-flow-col ${GRID_CONFIG.GRID_ROWS[4]}`
  }

  const rows = Math.min(Math.ceil(count / GRID_CONFIG.COLUMNS), 6)
  const gridRowsClass =
    GRID_CONFIG.GRID_ROWS[rows as keyof typeof GRID_CONFIG.GRID_ROWS] ?? GRID_CONFIG.GRID_ROWS[6]

  return `${GRID_CONFIG.BASE_CLASSES} grid-flow-col ${gridRowsClass}`
}

export default function DesktopNavigation() {
  return (
    <NavigationMenu
      className="hidden lg:flex w-full justify-end uppercase leading-none z-99"
      role="navigation"
      aria-label="Main navigation"
    >
      <NavigationMenuList>
        {MENU_ITEMS.map((item) => (
          <NavigationMenuItem key={`nav-item-${item.id}`}>
            {item.children ? (
              <>
                <NavigationMenuTrigger className={triggerButtonClasses}>
                  {item.label}
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className={getSubmenuClasses(item.children.length)}>
                    {item.children.map((subItem) =>
                      subItem.route ? (
                        <NavigationMenuLink
                          key={`nav-item-${item.id}-subitem-${subItem.id}`}
                          className={triggerButtonClasses}
                          asChild
                        >
                          <NavigationLink
                            route={subItem.route}
                            routeParams={subItem.routeParams}
                            title={subItem.label}
                          />
                        </NavigationMenuLink>
                      ) : subItem.href ? (
                        <NavigationMenuLink
                          key={`nav-item-${item.id}-subitem-${subItem.id}`}
                          className={triggerButtonClasses}
                          asChild
                        >
                          <NavigationLink href={subItem.href} title={subItem.label} />
                        </NavigationMenuLink>
                      ) : null
                    )}
                  </div>
                </NavigationMenuContent>
              </>
            ) : hasLink(item) ? (
              <NavigationMenuLink className={triggerButtonClasses} asChild>
                {item.route ? (
                  <Link route={item.route} routeParams={item.routeParams}>
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} target={item.target} rel={getRelAttribute(item)}>
                    {item.label}
                  </a>
                )}
              </NavigationMenuLink>
            ) : (
              <NavigationMenuLink>{item.label}</NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}

        <NavigationMenuItem>
          <Button
            variant="secondary"
            className="py-4 laptop:py-7 hover:bg-primary text-sm laptop:text-base font-bold"
            asChild
          >
            <Link route="donate.index" aria-label="Make a donation">
              <HandHeart aria-hidden="true" />
              Donner
            </Link>
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
