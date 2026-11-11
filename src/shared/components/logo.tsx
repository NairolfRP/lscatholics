import type { ImageProps } from '#shared/components/image'
import { Image } from '#shared/components/image'

type Props = Omit<ImageProps, 'src' | 'alt'> & {
  src?: string
  alt?: string
}

export function Logo({
  src = '/assets/images/logo-white.webp',
  alt = 'Logo',
  loading = 'lazy',
  ...props
}: Props) {
  return <Image {...(props as ImageProps)} src={src} alt={alt} loading={loading} />
}
