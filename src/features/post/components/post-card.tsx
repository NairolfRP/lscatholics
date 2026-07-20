import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { ArrowRight } from 'lucide-react'
import { Button } from '#/shared/components/ui/button'
import { Card, CardAction, CardFooter, CardHeader, CardTitle } from '#/shared/components/ui/card'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { cn } from '#/shared/lib/utils'
import { formatDate } from '#/utils/date'

type Props = {
  slug: string
  title: string
  image?: string
  category?: string
  publishedAt?: string
}

export default function PostCard({
  slug,
  title,
  image,
  category = 'Archidiocèse',
  publishedAt,
}: Props) {
  return (
    <article className="group">
      <Link to="/post/$slug" params={{ slug }} preload={false}>
        <Card className={cn('card-hover h-full justify-between', { 'pt-0': image })}>
          {image && (
            <Image
              src={image}
              alt="Event cover"
              className="z-20 aspect-video w-full object-cover"
              loading="lazy"
              layout="fullWidth"
            />
          )}
          <CardHeader>
            <div className="text-sm font-bold text-primary uppercase">{category}</div>
            <CardTitle className="mb-1 text-xl font-bold transition-colors group-hover:text-catholic-gold">
              {title}
            </CardTitle>
            <span className="text-base font-normal">
              {publishedAt && <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>}
            </span>
          </CardHeader>
          <CardFooter>
            <CardAction className="flex">
              <Button variant="link" size="sm" className="px-0 text-catholic-gold">
                Lire la suite
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardAction>
          </CardFooter>
        </Card>
      </Link>
    </article>
  )
}

export function PostCardSkeleton() {
  return (
    <Card className="h-full justify-between pt-0">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardHeader>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-2 h-6 w-3/4" />
        <Skeleton className="mt-2 h-6 w-1/2" />
        <Skeleton className="mt-3 h-4 w-32" />
      </CardHeader>
      <CardFooter>
        <Skeleton className="h-4 w-28" />
      </CardFooter>
    </Card>
  )
}
