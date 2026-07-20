import type { AnyRouteMatch } from '@tanstack/react-router'
import { envClient } from '#/config/env-client'

type ArticleSEO = {
  publishedTime?: string
  modifiedTime?: string
  expirationTime?: string
  authorPath?: string
  section?: string
  tags?: Array<string>
}

type PageMetadata = {
  description?: string
  language?: string
  keywords?: Array<string>
  image?: string
  url?: string
  article?: ArticleSEO
}

type Options = {
  metadata?: PageMetadata
  overrides?: AnyRouteMatch['meta']
}

const defaultDescription =
  "Site internet fictif de l'Archidiocèse de Los Santos, une faction roleplay sur le serveur GTA World France qui incarne l'Église catholique"
const defaultImage = '/assets/images/logo.webp'

export function pageMetadata(pageTitle?: string, options: Options = {}): AnyRouteMatch['meta'] {
  const {
    metadata = {
      description: defaultDescription,
      image: defaultImage,
    },
    overrides = [],
  } = options

  const title = pageTitle ? `${pageTitle} | ${envClient.VITE_APP_TITLE}` : envClient.VITE_APP_TITLE

  return [
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      title,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      property: 'og:site_name',
      content: import.meta.env.VITE_APP_NAME,
    },
    {
      property: 'og:locale',
      content: import.meta.env.VITE_LANGUAGE === 'fr' ? 'fr_FR' : 'en_US',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: 'summary',
    },
    {
      name: 'author',
      content: 'NairolfRP',
    },
    {
      property: 'og:url',
      content: import.meta.env.VITE_APP_URL,
    },
    {
      name: 'twitter:url',
      content: import.meta.env.VITE_APP_URL,
    },
    {
      name: 'twitter:creator',
      content: 'NairolfRP',
    },
    ...(metadata.description
      ? [
          {
            name: 'description',
            content: truncate(metadata.description, 150),
          },
          {
            property: 'og:description',
            content: truncate(metadata.description, 200),
          },
          {
            name: 'twitter:description',
            content: truncate(metadata.description, 200),
          },
        ]
      : []),
    ...(metadata.language ? [{ property: 'og:locale', content: metadata.language }] : []),
    ...(Array.isArray(metadata.keywords) && metadata.keywords.length > 0
      ? [{ name: 'keywords', content: metadata.keywords.join(', ') }]
      : []),
    ...(metadata.image
      ? [
          {
            property: 'og:image',
            content: metadata.image,
          },
          {
            name: 'twitter:image',
            content: metadata.image,
          },
        ]
      : []),
    ...(metadata.url
      ? [
          {
            property: 'og:url',
            content: `${import.meta.env.VITE_APP_URL}${metadata.url.startsWith('/') ? '' : '/'}${metadata.url}`,
          },
          {
            name: 'twitter:url',
            content: `${import.meta.env.VITE_APP_URL}${metadata.url.startsWith('/') ? '' : '/'}${metadata.url}`,
          },
        ]
      : []),
    ...(metadata.article ? generateArticleMetadata(metadata.article) : []),
    ...(Array.isArray(overrides) ? overrides : []),
  ]
}

function generateArticleMetadata(article: ArticleSEO) {
  const result = [
    {
      property: 'og:type',
      content: 'article',
    },
  ]

  if (article.publishedTime) {
    result.push({
      property: 'article:published_time',
      content: article.publishedTime,
    })
  }

  if (article.modifiedTime) {
    result.push({
      property: 'article:modified_time',
      content: article.modifiedTime,
    })
  }

  if (article.expirationTime) {
    result.push({
      property: 'article:expiration_time',
      content: article.expirationTime,
    })
  }

  if (article.authorPath) {
    result.push({
      property: 'article:author',
      content: article.authorPath,
    })
  }

  if (article.section) {
    result.push({
      property: 'article:section',
      content: article.section,
    })
  }

  if (Array.isArray(article.tags) && article.tags.length > 0) {
    result.push({
      property: 'article:tag',
      content: article.tags.join(', '),
    })
  }

  return result
}

function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text

  const cut = text.substring(0, limit - 1).trimEnd()
  const lastSpace = cut.lastIndexOf(' ')

  return (lastSpace > limit * 0.7 ? cut.substring(0, lastSpace) : cut) + '…'
}
