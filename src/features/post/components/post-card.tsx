import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { ArrowRight, CalendarIcon } from 'lucide-react'
import { Badge } from '#/shared/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { cn } from '#/shared/lib/utils'
import { formatDate } from '#/utils/date'

type Props = {
  slug: string
  title: string
  image?: string
  category?: string
  excerpt?: string
  publishedAt?: string
}

export default function PostCard({
  slug,
  title,
  image,
  category = 'Archidiocèse',
  excerpt,
  publishedAt,
}: Props) {
  return (
    <article className="group h-full">
      <Link
        to="/post/$slug"
        params={{ slug }}
        preload={false}
        className="block h-full rounded-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Card className={cn('h-full justify-between', image && 'pt-0')}>
          {image && (
            <div className="overflow-hidden">
              <Image
                src={image}
                alt={`Image de couverture - Article "${title}"`}
                className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                layout="fullWidth"
              />
            </div>
          )}
          <CardHeader className="flex flex-1 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Badge variant="secondary" className="uppercase">
                {category}
              </Badge>
              {publishedAt && (
                <time
                  dateTime={publishedAt}
                  className="flex items-center gap-1 text-sm text-muted-foreground"
                >
                  <CalendarIcon className="size-3.5" />
                  {formatDate(publishedAt)}
                </time>
              )}
            </div>
            <CardTitle className="text-xl leading-snug font-bold transition-colors group-hover:text-catholic-gold">
              {title}
            </CardTitle>
            {excerpt && (
              <CardDescription className="line-clamp-3 text-sm/relaxed">{excerpt}</CardDescription>
            )}
          </CardHeader>
          <CardFooter>
            <CardAction className="flex items-center text-sm font-semibold text-catholic-gold">
              Lire la suite
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
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
      <CardHeader className="gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </CardHeader>
      <CardFooter>
        <Skeleton className="h-4 w-28" />
      </CardFooter>
    </Card>
  )
}
