import type { ImageProps as UnpicImageProps } from '@unpic/react/base'
import type { TransformerFunction } from 'unpic'
import type { VercelOperations, VercelOptions } from 'unpic/providers/vercel'
import { Image as UnpicImage } from '@unpic/react/base'
import { transform as vercelTransform } from 'unpic/providers/vercel'
import { VERCEL_IMAGE_SIZES } from '#shared/lib/vercel-image-sizes'

export type ImageProps = Omit<
  UnpicImageProps<VercelOperations, VercelOptions>,
  'transformer' | 'options'
>

type Layout = ImageProps['layout']

function snapWidth(width: number) {
  return VERCEL_IMAGE_SIZES.find((size) => size >= width) ?? VERCEL_IMAGE_SIZES.at(-1)!
}

function getBreakpoints(
  width: number | undefined,
  layout: Layout,
  breakpoints: number[] | undefined
) {
  if (breakpoints) {
    return [...new Set(breakpoints.map(snapWidth))].sort((a, b) => a - b)
  }
  if (layout === 'fullWidth') {
    return VERCEL_IMAGE_SIZES
  }
  if (!width) {
    return undefined
  }
  const min = snapWidth(width)
  const max = snapWidth(width * 2)
  const candidates =
    layout === 'fixed'
      ? [min, max]
      : [min, ...VERCEL_IMAGE_SIZES.filter((size) => size > min && size < max), max]
  return [...new Set(candidates)].sort((a, b) => a - b)
}

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
  if (operations.width) {
    const width = Number(operations.width)
    const snapped = snapWidth(width)
    if (snapped !== width) {
      const height = operations.height
        ? Math.round(Number(operations.height) * (snapped / width))
        : undefined
      return vercelTransform(src, { ...operations, width: snapped, height }, options)
    }
  }
  return vercelTransform(src, operations, options)
}

export function Image({ breakpoints, ...props }: ImageProps) {
  return (
    <UnpicImage
      {...(props as UnpicImageProps<VercelOperations, VercelOptions>)}
      transformer={vercelTransformer}
      options={{ baseUrl: '', prefix: '_vercel' }}
      breakpoints={getBreakpoints(
        props.width ? Number(props.width) : undefined,
        props.layout,
        breakpoints
      )}
    />
  )
}
