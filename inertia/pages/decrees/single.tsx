import { InertiaProps } from '@/types'
import { Typography } from '@/shared/components/ui/typography'
import { Container } from '@/shared/components/ui/container'
import { MarkdownContent } from '@/shared/components/ui/markdown'
import { Button } from '@/shared/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { Calendar, ChevronLeft, ScrollText, ShieldCheck } from 'lucide-react'
import Head from '@/shared/components/app-head'
import { toOgDescription } from '@/lib/utils'
import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'

type PageProps = InertiaProps<{
  decree: {
    title: string
    slug: string
    description: string
    timestamp?: string
    image?: string
    thumbnail?: string
    fields: Array<{ name: string; value: string }>
  }
  metadata: {
    isEnforceable: boolean
    isEnacted: boolean
    isInEffect: boolean
  }
}>

export default function Single({ decree, metadata }: PageProps) {
  const metaDescription = useMemo(() => toOgDescription(decree.description), [decree.description])

  return (
    <>
      <Head title={decree.title}>
        <meta property="article:section" content="Décrets" />
        <meta head-key="og:type" property="og:type" content="article" />

        <meta head-key="og:description" property="og:description" content={metaDescription} />
        <meta
          head-key="twitter:description"
          property="twitter:description"
          content={metaDescription}
        />

        <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
        {decree.image && (
          <>
            <meta head-key="og:image" property="og:image" content={decree.image} />
            <meta head-key="twitter:image" property="twitter:image" content={decree.image} />
          </>
        )}

        {decree.timestamp && <meta property="article:published_time" content={decree.timestamp} />}
      </Head>
      <Container as="article" size="content" className="p-2 sm:px-8 flex flex-col gap-5 py-50">
        <Link route="decrees.index" className="mb-5">
          <Button variant="link">
            <ChevronLeft /> Voir les autres décrets
          </Button>
        </Link>

        <Card className="m-0">
          {decree.image && (
            <img
              src={decree.image}
              className="z-20 aspect-video w-full object-contain"
              alt="Decree image (generally the seal of the archbishop or seal/logo of the decree's author)"
              loading="lazy"
            />
          )}

          <CardHeader>
            <CardTitle>
              <Typography variant="h2">{decree.title}</Typography>
            </CardTitle>

            <CardDescription>
              <div className="flex w-full flex-wrap gap-2">
                {decree.timestamp && (
                  <Badge variant="outline">
                    <Calendar />{' '}
                    <time>{new Date(decree.timestamp).toLocaleDateString('fr-FR')}</time>
                  </Badge>
                )}
                {metadata.isEnforceable && (
                  <>
                    {metadata.isEnacted && (
                      <Badge variant="info">
                        <ScrollText data-icon="inline-start" />
                        Promulgué
                      </Badge>
                    )}
                    {metadata.isInEffect && (
                      <Badge variant="success">
                        <ShieldCheck data-icon="inline-start" /> En vigueur
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <MarkdownContent content={decree.description} />
              {decree.fields.length > 0 && (
                <Typography variant="list">
                  {decree.fields.map((field, i) => (
                    <li key={i}>
                      <strong>{field.name}</strong> : <MarkdownContent content={field.value} />
                    </li>
                  ))}
                </Typography>
              )}
            </div>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
