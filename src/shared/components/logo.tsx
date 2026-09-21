import { Image } from '#shared/components/image'
import type { ImageProps } from '#shared/components/image'

type Props = Omit<ImageProps, 'src' | 'alt'> & {
  alt?: string
}

export function Logo({ alt = 'Logo', loading = 'lazy', ...props }: Props) {
  return (
    <Image {...(props as ImageProps)} src="/assets/images/logo.webp" alt={alt} loading={loading} />
  )
}
