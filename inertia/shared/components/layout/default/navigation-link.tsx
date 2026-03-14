import type { registry } from '@generated/registry'
import { Link } from '@adonisjs/inertia/react'
import { MouseEvent, PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  route?: keyof typeof registry.routes
  routeParams?: Record<string, any>
  href?: string
  title?: string
  onClick?: (e: MouseEvent) => void
}>

export default function NavigationLink({
  children,
  route,
  routeParams,
  href = '#',
  title,
  onClick,
}: Props) {
  if (route) {
    return (
      <Link
        route={route}
        routeParams={routeParams}
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
        onClick={onClick}
      >
        <div className="text-sm font-medium leading-none group-hover:text-catholic-gold transition-colors">
          {title}
        </div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
      </Link>
    )
  }

  return (
    <a
      href={href}
      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
      onClick={onClick}
    >
      <div className="text-sm font-medium leading-none group-hover:text-catholic-gold transition-colors">
        {title}
      </div>
      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
    </a>
  )
}
