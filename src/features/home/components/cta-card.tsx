import { Link } from '@tanstack/react-router'
import { Card, CardDescription, CardHeader, CardTitle } from '#/shared/components/ui/card'
import type { CTA } from '../types/home.types'

export function CTACard({ item: { icon: Icon, ...item } }: { item: CTA }) {
  const content = () => {
    return (
      <Card className="h-full transition hover:border hover:border-primary hover:shadow-lg">
        <CardHeader className="flex flex-col items-center text-center">
          {Icon && <Icon className="mb-2 size-8" />}
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (item.href) {
    return (
      <a href={item.href} target="_blank">
        {content()}
      </a>
    )
  }

  return <Link to={item.to}>{content()}</Link>
}
