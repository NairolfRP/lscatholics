import type { ComponentProps, ReactNode } from 'react'
import React from 'react'
import { Image } from '@unpic/react'
import type { ImageProps } from '@unpic/react'
import { Link } from '@tanstack/react-router'
import type { Button } from '#/shared/components/ui/button'
import { buttonVariants } from '#/shared/components/ui/button'
import { Typography } from '#/shared/components/ui/typography'
import { cn } from '#/shared/lib/utils'
import { isExternalLink } from '#/utils/link'

export type HeroVariant = 'image' | 'video' | 'minimal' | 'split'
export type HeroSize = 'sm' | 'md' | 'lg' | 'full'
export type HeroAlign = 'left' | 'center' | 'right'

export interface HeroAction {
  label: string | ReactNode
  href: string
  variant?: ComponentProps<typeof Button>['variant']
}

export interface HeroProps {
  title: string | React.ReactElement
  subtitle?: string | React.ReactElement
  actions?: HeroAction[]
  /** Extra content below actions — use HeroStats, HeroScrollCue, etc. */
  children?: ReactNode

  variant?: HeroVariant
  /** Controls min-height. Defaults: image/video→lg, minimal→sm, split→md */
  size?: HeroSize
  align?: HeroAlign

  imageSrc?: string
  imageAlt?: string
  /** CSS object-position — keyword ("top", "center", "bottom") or arbitrary value ("50% 20%"). */
  imagePosition?: string
  videoSrc?: string
  /** Dark overlay intensity 0–100. Default 55. */
  overlayOpacity?: number
  /** Any CSS color or var(). Used by minimal + split. */
  backgroundColor?: string

  className?: string
}

const sizes: Record<HeroSize, string> = {
  sm: 'min-h-[320px] pt-[calc(var(--header-height)+1rem)] pb-16',
  md: 'min-h-[480px] pt-[calc(var(--header-height)+1rem)] pb-24',
  lg: 'min-h-[640px] pt-[calc(var(--header-height)+5rem)] pb-32',
  full: 'min-h-[100svh] pt-[calc(var(--header-height)+10rem)] pb-32',
}

const contentAlign: Record<HeroAlign, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
}

const wrapAlign: Record<HeroAlign, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

function ActionLink({ label, href, variant = 'default' }: HeroAction) {
  const cls =
    variant === 'ghost'
      ? cn(
          buttonVariants({ variant }),
          'text-background dark:text-foreground dark:hover:bg-muted dark:hover:text-foreground'
        )
      : buttonVariants({ variant })
  if (isExternalLink(href)) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    )
  }
  return (
    <Link to={href} className={cls}>
      {label}
    </Link>
  )
}

function Overlay({ opacity = 55 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/[--mid] to-black/20"
      style={{ '--mid': `${opacity / 100}` } as React.CSSProperties}
    />
  )
}

function Actions({ actions, align }: { actions: HeroAction[]; align: HeroAlign }) {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-3',
        align === 'center' && 'justify-center',
        align === 'right' && 'justify-end'
      )}
    >
      {actions.map((action) => (
        <ActionLink key={action.href} {...action} />
      ))}
    </div>
  )
}

/** Shared inner layout. Spread into each variant rather than nesting. */
function Content({
  title,
  subtitle,
  actions,
  align = 'left',
  children,
}: Pick<HeroProps, 'title' | 'subtitle' | 'actions' | 'align' | 'children'>) {
  return (
    <div className={cn('relative z-10 flex flex-col gap-5', contentAlign[align])}>
      {typeof title === 'string' ? (
        <Typography
          variant="h1"
          className={cn(
            'leading-[1.08] tracking-[-0.02em] text-balance text-white',
            'text-4xl sm:text-5xl md:text-6xl xl:text-7xl',
            '[text-shadow:0_2px_32px_rgba(0,0,0,0.4)]'
          )}
        >
          {title}
        </Typography>
      ) : (
        React.cloneElement(title as never, {
          className: cn(
            'text-balance text-white',
            'text-4xl sm:text-5xl md:text-6xl xl:text-7xl',
            '[text-shadow:0_2px_32px_rgba(0,0,0,0.4)]'
          ),
        })
      )}
      {subtitle && (
        <>
          {typeof subtitle === 'string' ? (
            <p className="max-w-2xl text-base/relaxed font-medium text-white/80 sm:text-lg">
              {subtitle}
            </p>
          ) : (
            <div className="text-base/relaxed font-medium text-white/80 sm:text-lg">{subtitle}</div>
          )}
        </>
      )}
      {!!actions?.length && <Actions actions={actions} align={align} />}
      {children}
    </div>
  )
}

export function ImageHero({
  title,
  subtitle,
  actions,
  children,
  imageSrc = '',
  imageAlt = '',
  imagePosition = 'center',
  overlayOpacity = 55,
  size = 'lg',
  align = 'center',
  className,
}: HeroProps) {
  return (
    <section className={cn('relative flex w-full overflow-hidden', sizes[size], className)}>
      {imageSrc && (
        <Image
          {...({
            src: imageSrc,
            alt: imageAlt,
            layout: 'fullWidth',
            fetchPriority: 'high',
            decoding: 'async',
            className: 'absolute inset-0 h-full w-full object-cover',
            style: { objectPosition: imagePosition },
          } as ImageProps)}
        />
      )}
      <Overlay opacity={overlayOpacity} />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent"
      />
      <div
        className={cn(
          'relative container mx-auto flex w-full flex-col justify-end px-6 md:px-10',
          wrapAlign[align]
        )}
      >
        <Content title={title} subtitle={subtitle} actions={actions} align={align}>
          {children}
        </Content>
      </div>
    </section>
  )
}

export function MinimalHero({
  title,
  subtitle,
  actions,
  children,
  size = 'sm',
  align = 'left',
  backgroundColor = 'bg-zinc-900',
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        'relative flex w-full overflow-hidden',
        sizes[size],
        backgroundColor,
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '256px 256px',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-white/20 to-transparent"
      />
      <div
        className={cn(
          'relative mx-auto flex w-full max-w-7xl flex-col justify-center px-6 md:px-10',
          wrapAlign[align]
        )}
      >
        <Content title={title} subtitle={subtitle} actions={actions} align={align}>
          {children}
        </Content>
      </div>
    </section>
  )
}

/** Text left / photo right. Reverse via `className="[&>div]:grid-flow-dense [&_picture]:order-first"`. */
export function SplitHero({
  title,
  subtitle,
  actions,
  children,
  imageSrc = '',
  imageAlt = '',
  imagePosition = 'center',
  size = 'md',
  backgroundColor = 'var(--color-zinc-900)',
  className,
}: HeroProps) {
  return (
    <section
      className={cn('relative w-full overflow-hidden', className)}
      style={{ backgroundColor }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2">
        <div className="relative z-10 flex flex-col justify-center gap-5 px-6 py-16 md:px-10 md:py-24 lg:py-32">
          <Content title={title} subtitle={subtitle} actions={actions}>
            {children}
          </Content>
        </div>
        <div className={cn('relative min-h-80', sizes[size])}>
          {imageSrc && (
            <img
              src={imageSrc}
              alt={imageAlt}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: imagePosition }}
            />
          )}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-24"
            style={{
              backgroundImage: `linear-gradient(to right, ${backgroundColor}, transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  )
}

/** Requires "use client" in the importing file — <video> autoplay needs the browser. */
export function VideoHero({
  title,
  subtitle,
  actions,
  children,
  videoSrc = '',
  overlayOpacity = 60,
  size = 'full',
  align = 'left',
  className,
}: HeroProps) {
  return (
    <section className={cn('relative flex w-full overflow-hidden', sizes[size], className)}>
      {videoSrc && (
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
      )}
      <Overlay opacity={overlayOpacity} />
      <div
        className={cn(
          'relative mx-auto flex w-full max-w-7xl flex-col justify-end px-6 md:px-10',
          wrapAlign[align]
        )}
      >
        <Content title={title} subtitle={subtitle} actions={actions} align={align}>
          {children}
        </Content>
      </div>
    </section>
  )
}

/**
 * Hero section
 *
 * Variants:
 *  - "image"   → full-bleed photo + dark overlay          (RSC ✓)
 *  - "minimal" → solid background, no media               (RSC ✓)
 *  - "split"   → text left, photo right                   (RSC ✓)
 *  - "video"   → looping video background                 (needs "use client")
 */
export function Hero(props: HeroProps) {
  switch (props.variant) {
    case 'video':
      return <VideoHero {...props} />
    case 'minimal':
      return <MinimalHero {...props} />
    case 'split':
      return <SplitHero {...props} />
    default:
      return <ImageHero {...props} />
  }
}

export default Hero
