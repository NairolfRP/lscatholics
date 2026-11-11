import type { ImageProps } from '#shared/components/image'
import { Image } from '#shared/components/image'
import { cn } from '#shared/lib/utils'

type Props = Omit<ImageProps, 'src' | 'alt'> & {
  src?: string
  alt?: string
}

export function Logo({
  src = '/assets/images/logo-white.webp',
  alt = 'Logo',
  loading = 'lazy',
  className,
  ...props
}: Props) {
  return (
    <Image
      {...(props as ImageProps)}
      src={src}
      alt={alt}
      loading={loading}
      className={cn('transition-opacity duration-300 ease-in-out hover:opacity-80', className)}
    />
  )
}
