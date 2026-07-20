import type { Components as ReactMarkdownComponents } from 'react-markdown'
import React from 'react'
import { Link } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import remarkBreaks from 'remark-breaks'
import { cn } from '#/shared/lib/utils'
import { toInternalPath } from '#/utils/link'
import { Separator } from './separator'
import { Typography } from './typography'

type MarkdownContentProps = {
  content: string
  className?: string
}

function HeadingLink({
  children,
  variant,
  id,
  ...props
}: {
  children: React.ReactNode
  variant: 'h1' | 'h2' | 'h3'
  id?: string
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Typography variant={variant} id={id} {...props} className="group">
      {children}
      {id && (
        <a
          href={`#${id}`}
          className="px-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        >
          #
        </a>
      )}
    </Typography>
  )
}

const MarkdownComponents: ReactMarkdownComponents = {
  h1: ({ children, id, ...props }) => (
    <HeadingLink {...props} variant="h1" id={id}>
      {children}
    </HeadingLink>
  ),
  h2: ({ children, id, ...props }) => (
    <HeadingLink {...props} variant="h2" id={id}>
      {children}
    </HeadingLink>
  ),
  h3: ({ children, id, ...props }) => (
    <HeadingLink {...props} variant="h3" id={id}>
      {children}
    </HeadingLink>
  ),
  p: ({ children }) => (
    <Typography variant="p" className="mb-4 leading-7">
      {children}
    </Typography>
  ),
  blockquote: ({ children }) => (
    <Typography variant="blockquote" className="mb-4">
      {children}
    </Typography>
  ),
  ul: ({ children }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
  ol: ({ children }) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,
  li: ({ children }) => <li className="mt-2">{children}</li>,
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-lg border bg-muted p-4">{children}</pre>
  ),
  code: ({ children }) => <Typography variant="inline-code">{children}</Typography>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, title, children }) => {
    if (!href) {
      return <span>{children}</span>
    }

    const internalPath = toInternalPath(href)

    if (internalPath !== null) {
      return (
        <Link to={internalPath} title={title ?? undefined}>
          {children}
        </Link>
      )
    }

    const isSafeProtocol = href.startsWith('https://') || href.startsWith('http://')
    if (!isSafeProtocol) return <span>{children}</span>

    return (
      <a href={href} title={title ?? undefined} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  },
  img: ({ src, alt, title }) => (
    <img
      src={src}
      alt={alt}
      title={title}
      className="my-6 h-auto max-w-full rounded-lg shadow-md"
      loading="lazy"
    />
  ),
  hr: () => <Separator className="my-8 border-border" />,
  del: ({ children }) => <del className="line-through">{children}</del>,
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
  th: ({ children }) => (
    <th className="border border-border px-4 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border border-border px-4 py-2">{children}</td>,
}

export function Markdown({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        'markdown-content [&_img]:h-auto [&_img]:max-w-full [&_input[type=checkbox]]:mr-2 [&_table]:block [&_table]:overflow-x-auto',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        rehypePlugins={[rehypeSlug]}
        components={MarkdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
