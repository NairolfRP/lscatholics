import { cn } from '@/lib/utils'
import { Link } from '@adonisjs/inertia/react'
import { urlFor } from '@/client'
import type { InferRoutes, QueryParameters } from '@tuyau/core/types'
import type { registry } from '@generated/registry'
import type { AnchorHTMLAttributes } from 'react'
import type { InertiaLinkProps } from '@inertiajs/react'

type BaseProps = {
  route?: keyof InferRoutes<typeof registry>
  params?: {
    params: readonly [string | number]
    query?: QueryParameters
  }
  className?: string
  children?: React.ReactNode
}

type ExternalProps = AnchorHTMLAttributes<HTMLAnchorElement> & BaseProps & { external: true }
type InternalProps = InertiaLinkProps & BaseProps & { external?: false | undefined }
type Props = ExternalProps | InternalProps

export function LinkText(props: Props) {
  const { route, params, className, children, external, ...rest } = props

  const href = !external && route ? urlFor(route as any, params) : (props as ExternalProps).href

  if (external) {
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
      href={href!}
      className={cn(
        'font-medium text-primary underline underline-offset-4 cursor-pointer',
        className
      )}
    >
      {children}
    </Link>
  )
}
