import { InertiaProps } from '@/types'
import { Typography } from '@/shared/components/ui/typography'
import { Container } from '@/shared/components/ui/container'
import { MarkdownContent } from '@/shared/components/ui/markdown'
import { Button } from '@/shared/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { ChevronLeft } from 'lucide-react'

type PageProps = InertiaProps<{
  title: string
  description: string
  timestamp?: string
  image?: string
  thumbnail?: string
  fields: Array<{ name: string; value: string }>
}>

export default function Single({ title, description, timestamp, image, fields }: PageProps) {
  return (
    <Container as="article" size="content" className="flex flex-col gap-5 py-50">
      <Link route="decrees.index" className="mb-5">
        <Button variant="link">
          <ChevronLeft /> Voir les autres décrets
        </Button>
      </Link>

      <Typography variant="h2">{title}</Typography>

      {image && (
        <img
          src={image}
          className="mx-auto py-5 max-w-1/3 h-auto"
          alt="Decree image (generally the seal of the archbishop or seal/logo of the decree's author)"
          loading="lazy"
        />
      )}

      {timestamp && (
        <Typography>
          Le <time>{new Date(timestamp).toLocaleDateString('fr-FR')}</time>,
        </Typography>
      )}

      <div>
        <MarkdownContent content={description} />
        {fields.length > 0 && (
          <Typography variant="list">
            {fields.map((field) => (
              <li>
                <strong>{field.name}</strong> : <MarkdownContent content={field.value} />
              </li>
            ))}
          </Typography>
        )}
      </div>
    </Container>
  )
}
