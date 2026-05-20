import { InertiaProps } from '@/shared/types/pages'
import { Container } from '@/shared/components/ui/container'
import { Typography } from '@/shared/components/ui/typography'
import { LinkText } from '@/shared/components/link-text'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Deferred } from '@inertiajs/react'
import { Fragment } from 'react'
import { Separator } from '@/shared/components/ui/separator'
import Head from '@/shared/components/app-head'

type Decree = { uid: string; title: string; tags: string[] }

type PageProps = InertiaProps<{
  decrees?: {
    executive: Decree[]
    law: Decree[]
    administrative: Decree[]
    judicial: Decree[]
  }
}>

const DecreesSkeleton = () => {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-2 mt-7">
      {Array.from({ length: 3 }).map((_, i) => (
        <Fragment key={i}>
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </Fragment>
      ))}
    </div>
  )
}

export default function Index({ decrees }: PageProps) {
  return (
    <>
      <Head title="Décrets" />
      <Container size="content" className="flex flex-col gap-5 py-50">
        <Typography variant="h2">Décrets</Typography>
        <Typography>
          Les décrets sont les décisions de droit canonique (c'est-à-dire, le droit de l'Église)
          prisent par l'Archevêque ou son délégué en matière exécutif, législatif ou judiciaire. Le
          Chancelier est chargé de contresigner et de diffuser ces textes pour attester leur
          authenticité.
        </Typography>

        <Separator />

        <div className="flex flex-col mt-5">
          <Deferred data="decrees" fallback={<DecreesSkeleton />}>
            <Typography variant="h3">Exécutif</Typography>
            <Typography variant="list">
              {decrees?.executive?.map((decree) => (
                <li key={decree.uid}>
                  <LinkText route="decrees.single" routeParams={{ uid: `${decree.uid}` }}>
                    {decree.title}
                  </LinkText>
                </li>
              ))}
            </Typography>

            <Typography variant="h3">Administratif</Typography>
            <Typography variant="list">
              {decrees?.administrative?.map((decree) => (
                <li key={decree.uid}>
                  <LinkText route="decrees.single" routeParams={{ uid: `${decree.uid}` }}>
                    {decree.title}
                  </LinkText>
                </li>
              ))}
            </Typography>

            <Typography variant="h3">Lois canoniques</Typography>
            <Typography variant="list">
              {decrees?.law?.map((decree) => (
                <li key={decree.uid}>
                  <LinkText route="decrees.single" routeParams={{ uid: `${decree.uid}` }}>
                    {decree.title}
                  </LinkText>
                </li>
              ))}
            </Typography>

            <Typography variant="h3">Judiciaire</Typography>
            <Typography variant="list">
              {decrees?.judicial?.map((decree) => (
                <li key={decree.uid}>
                  <LinkText route="decrees.single" routeParams={{ uid: `${decree.uid}` }}>
                    {decree.title}
                  </LinkText>
                </li>
              ))}
            </Typography>
          </Deferred>
        </div>
      </Container>
    </>
  )
}
