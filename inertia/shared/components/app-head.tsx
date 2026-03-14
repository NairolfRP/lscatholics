import type { PropsWithChildren } from 'react'
import { ComponentProps, useMemo } from 'react'
import Logo from '@/assets/images/logo.png'
import { Head, usePage } from '@inertiajs/react'
import type { Data } from '@generated/data'

type Props = PropsWithChildren<
  ComponentProps<typeof Head> & {
    description?: string
    image?: string
  }
>

export default function AppHead({
  children,
  title = '',
  description = "Site internet fictif de l'Archidiocèse catholique romain de Los Santos, une faction roleplay sur le serveur GTA World France qui incarne l'Église catholique",
  image = Logo,
}: Props) {
  const page = usePage<Data.SharedProps>()

  const fullPageTitle = useMemo(
    () => (title ? `${title} - Archidiocèse de Los Santos` : 'Archidiocèse de Los Santos'),
    [title]
  )

  const imageUrl = useMemo(
    () =>
      image.startsWith('https://') || image.startsWith('http')
        ? image
        : `https://archls.infos.st` + image,
    [image]
  )

  return (
    <Head>
      <title>{title}</title>

      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      <meta head-key="description" name="description" content={description} />
      <meta head-key="author" name="author" content="NairolfRP" />

      <meta head-key="og:title" property="og:title" content={fullPageTitle} />
      <meta head-key="og:description" property="og:description" content={description} />
      <meta head-key="og:image" property="og:image" content={imageUrl} />
      <meta head-key="og:url" property="og:url" content={page.url as string} />
      <meta head-key="og:type" property="og:type" content="website" />
      <meta property="og:site_name" content="Archidiocèse de Los Santos" />
      <meta head-key="og:locale" property="og:locale" content="fr_FR" />

      <meta head-key="twitter:card" property="twitter:card" content="summary" />
      <meta head-key="twitter:title" property="twitter:card" content={fullPageTitle} />
      <meta head-key="twitter:description" property="twitter:description" content={description} />
      <meta head-key="twitter:image" property="twitter:image" content={imageUrl} />
      <meta head-key="twitter:creator" property="twitter:creator" content="NairolfRP" />

      {children}
    </Head>
  )
}
