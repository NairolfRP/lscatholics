import { cn } from '@/lib/utils'
import { Link } from '@adonisjs/inertia/react'
import type { AnchorHTMLAttributes, ComponentProps, PropsWithChildren } from 'react'

type InertiaLinkProps = ComponentProps<typeof Link>

type ExternalProps = AnchorHTMLAttributes<HTMLAnchorElement> & { external: true }
type InternalProps = InertiaLinkProps
type Props = ExternalProps | InternalProps

export function LinkText(props: PropsWithChildren<Props>) {
  const { className, children, ...rest } = props

  if (!('route' in props)) {
    const href = (props as ExternalProps).href
    return (
      <a
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        href={href}
        className={cn(
          'font-medium text-primary underline underline-offset-4 cursor-pointer',
          className
        )}
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      {...(rest as InertiaLinkProps)}
      className={cn(
        'font-medium text-primary underline underline-offset-4 cursor-pointer',
        className
      )}
    >
      {children}
    </Link>
  )
}
