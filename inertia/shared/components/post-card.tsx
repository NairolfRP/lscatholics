import { Link } from '@adonisjs/inertia/react'
import { ArrowRight } from 'lucide-react'
import { Card, CardAction, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { formatDate } from '@/lib/utils'
import type { InferRoutes } from '@tuyau/core/types'
import type { registry } from '@generated/registry'

type Props = {
  route?: keyof InferRoutes<typeof registry>
  routeParams?: Record<string, any>
  category?: string
  title: string
  publishedAt?: string
}

export default function PostCard({
  route = 'news.single',
  routeParams = {},
  category = 'Archidiocèse',
  title = '',
  publishedAt = '',
}: Props) {
  return (
    <article className="group">
      <Link route={route} routeParams={routeParams}>
        <Card className="card-hover h-full">
          <CardHeader>
            <div className="uppercase font-bold text-primary text-sm">{category}</div>
            <CardTitle className="font-bold text-xl group-hover:text-catholic-gold transition-colors mb-1">
              {title}
            </CardTitle>
            <span className="text-base font-normal">
              {publishedAt && <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>}
            </span>
          </CardHeader>
          <CardFooter className="px-6">
            <CardAction className="flex">
              <Button variant="link" size="sm" className="text-catholic-gold">
                Lire la suite
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardAction>
          </CardFooter>
        </Card>
      </Link>
    </article>
  )
}
