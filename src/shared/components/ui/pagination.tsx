import * as React from 'react'
import type { RegisteredRouter, ValidateLinkOptions } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'
import type { Button } from '#/shared/components/ui/button'
import { buttonVariants } from '#/shared/components/ui/button'
import { cn } from '#/shared/lib/utils'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex items-center gap-1', className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TOptions = unknown,
> = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  ValidateLinkOptions<TRouter, TOptions>

function PaginationLink<TRouter extends RegisteredRouter, TOptions>({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps<TRouter, TOptions>) {
  return (
    <Link
      className={cn(buttonVariants({ variant: isActive ? 'outline' : 'ghost', size }), className)}
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      {...(props as ValidateLinkOptions<TRouter, TOptions>)}
    />
  )
}

function PaginationPrevious<TRouter extends RegisteredRouter, TOptions>({
  className,
  text = 'Précédent',
  ...props
}: { text?: string } & PaginationLinkProps<TRouter, TOptions>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn('pl-2!', className)}
      {...(props as PaginationLinkProps)}
    >
      <>
        <ChevronLeftIcon data-icon="inline-start" />
        <span className="hidden sm:block">{text}</span>
      </>
    </PaginationLink>
  )
}

function PaginationNext<TRouter extends RegisteredRouter, TOptions>({
  className,
  text = 'Suivant',
  ...props
}: { text?: string } & PaginationLinkProps<TRouter, TOptions>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn('pr-2!', className)}
      {...(props as PaginationLinkProps)}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
