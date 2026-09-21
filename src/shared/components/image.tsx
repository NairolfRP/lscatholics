import type { ImageProps as UnpicImageProps } from '@unpic/react/base'
import type { TransformerFunction } from 'unpic'
import type { VercelOperations, VercelOptions } from 'unpic/providers/vercel'
import { Image as UnpicImage } from '@unpic/react/base'
import { transform as vercelTransform } from 'unpic/providers/vercel'

export const VERCEL_IMAGE_SIZES = [
  640, 750, 828, 960, 1080, 1280, 1668, 1920, 2048, 2560, 3200, 3840,
]

const vercelTransformer: TransformerFunction<VercelOperations, VercelOptions> = (
  src,
  operations,
  options
) => {
  const source = typeof src === 'string' ? src : src.toString()
  if (
    !import.meta.env.PROD ||
    !source.startsWith('/') ||
    source.startsWith('//') ||
    source.startsWith('/_vercel/image')
  ) {
    return source
  }
  if (!operations.width && !operations.height) {
    return vercelTransform(src, { ...operations, width: VERCEL_IMAGE_SIZES.at(-1) }, options)
  }
  return vercelTransform(src, operations, options)
}

export type ImageProps = Omit<
  UnpicImageProps<VercelOperations, VercelOptions>,
  'transformer' | 'options'
>

export function Image(props: ImageProps) {
  const isFullWidth = props.layout === 'fullWidth'
  return (
    <UnpicImage
      {...(props as UnpicImageProps<VercelOperations, VercelOptions>)}
      transformer={vercelTransformer}
      options={{ baseUrl: '', prefix: '_vercel' }}
      breakpoints={props.breakpoints ?? (isFullWidth ? VERCEL_IMAGE_SIZES : undefined)}
    />
  )
}
