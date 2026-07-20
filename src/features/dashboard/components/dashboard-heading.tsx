import type { PropsWithChildren, ReactNode } from 'react'
import type { RegisteredRouter, ValidateLinkOptions } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { buttonVariants } from '#/shared/components/ui/button'
import { Typography } from '#/shared/components/ui/typography'
import { cn } from '#/shared/lib/utils'

type Props<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TOptions = unknown,
> = PropsWithChildren<{
  title: string
  description?: string | ReactNode
  right?: ReactNode
  backButton?: ValidateLinkOptions<TRouter, TOptions>
}>

export function DashboardHeading({ title, description, right, backButton }: Props) {
  if (backButton && right) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <DashboardHeadingBackButton {...backButton} />
            <DashboardHeadingTitle content={title} />
            {right}
          </div>
        </div>
        <DashboardHeadingDescription content={description} />
      </div>
    )
  }

  if (backButton) {
    return (
      <div>
        <div className="flex items-center gap-4">
          <DashboardHeadingBackButton {...backButton} />
          <div>
            <DashboardHeadingTitle content={title} />
          </div>
        </div>
        <DashboardHeadingDescription content={description} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <DashboardHeadingTitle content={title} />
        {right}
      </div>
      <DashboardHeadingDescription content={description} />
    </div>
  )
}

function DashboardHeadingDescription({ content }: { content?: string | ReactNode }) {
  if (!content) return null

  if (typeof content !== 'string') {
    return content
  }

  return (
    <Typography variant="p" className="text-muted-foreground">
      {content}
    </Typography>
  )
}

function DashboardHeadingTitle({ content }: { content?: string | ReactNode }) {
  if (!content) return null

  if (typeof content !== 'string') {
    return content
  }

  return <Typography variant="h1">{content}</Typography>
}

function DashboardHeadingBackButton<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TOptions = unknown,
>({ className, ...props }: ValidateLinkOptions<TRouter, TOptions>) {
  return (
    <Link
      className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), className)}
      aria-label="Retour"
      {...(props as ValidateLinkOptions<TRouter, TOptions>)}
    >
      <ArrowLeft className="size-7" />
    </Link>
  )
}
