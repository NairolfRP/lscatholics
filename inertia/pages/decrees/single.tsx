import { InertiaProps } from '@/types'
import { Typography } from '@/shared/components/ui/typography'
import { Container } from '@/shared/components/ui/container'
import { MarkdownContent } from '@/shared/components/ui/markdown'
import { Button } from '@/shared/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { ChevronLeft } from 'lucide-react'
import Head from '@/shared/components/app-head'
import { toOgDescription } from '@/lib/utils'
import { useMemo } from 'react'

type PageProps = InertiaProps<{
  title: string
  description: string
  timestamp?: string
  image?: string
  thumbnail?: string
  fields: Array<{ name: string; value: string }>
}>

export default function Single({ title, description, timestamp, image, fields }: PageProps) {
  const metaDescription = useMemo(() => toOgDescription(description), [description])

  return (
    <>
      <Head title={title}>
        <meta property="article:section" content="Décrets" />
        <meta head-key="og:type" property="og:type" content="article" />

        <meta head-key="og:description" property="og:description" content={metaDescription} />
        <meta
          head-key="twitter:description"
          property="twitter:description"
          content={metaDescription}
        />

        <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
        {image && (
          <>
            <meta head-key="og:image" property="og:image" content={image} />
            <meta head-key="twitter:image" property="twitter:image" content={image} />
          </>
        )}

        {timestamp && <meta property="article:published_time" content={timestamp} />}
      </Head>
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
              {fields.map((field, i) => (
                <li key={i}>
                  <strong>{field.name}</strong> : <MarkdownContent content={field.value} />
                </li>
              ))}
            </Typography>
          )}
        </div>
      </Container>
    </>
  )
}
