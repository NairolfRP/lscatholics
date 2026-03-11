import type { Components as ReactMarkdownComponents } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { Typography } from '@/shared/components/ui/typography'
import { LinkText } from '@/shared/components/link-text'
import { cn, slugify } from '@/lib/utils'
import { type ComponentProps, lazy, Suspense } from 'react'
import type { PreviewType } from '@uiw/react-md-editor'
import remarkBreaks from 'remark-breaks'

type MarkdownContentProps = {
  content: string
  className?: string
}

type MarkdownTextareaProps = ComponentProps<typeof MDEditor> & {
  id?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  rows?: number
  preview?: PreviewType
}

export const MDEditor = lazy(() => import('@uiw/react-md-editor'))

function HeadingLink({
  children,
  variant,
}: {
  children: React.ReactNode
  variant: 'h1' | 'h2' | 'h3'
}) {
  const id = slugify(children)
  return (
    <Typography variant={variant} className="mb-4 mt-8 first:mt-0 scroll-mt-20" id={id}>
      <a
        href={`#${id}`}
        className="group inline-flex items-center gap-2 no-underline hover:underline"
      >
        {children}
        <span
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
          aria-hidden="true"
        >
          #
        </span>
      </a>
    </Typography>
  )
}

const MarkdownComponents: ReactMarkdownComponents = {
  h1: ({ children }) => <HeadingLink variant="h1">{children}</HeadingLink>,
  h2: ({ children }) => <HeadingLink variant="h2">{children}</HeadingLink>,
  h3: ({ children }) => <HeadingLink variant="h3">{children}</HeadingLink>,
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
  code: ({ children }) => (
    <Typography variant="code" as="code" className="relative font-mono text-sm">
      {children}
    </Typography>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, title, children }) => {
    const isExternal = href?.startsWith('http://') || href?.startsWith('https://')
    return (
      <LinkText href={href ?? '#'} external={isExternal} title={title ?? undefined}>
        {children}
      </LinkText>
    )
  },
  img: ({ src, alt, title }) => (
    <img
      src={src}
      alt={alt}
      title={title}
      className="my-6 rounded-lg shadow-md max-w-full h-auto"
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
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

function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        'markdown-content [&_img]:max-w-full [&_img]:h-auto [&_table]:block [&_table]:overflow-x-auto [&_input[type=checkbox]]:mr-2',
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkBreaks]} components={MarkdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

function MarkdownTextarea({
  id,
  value = '',
  onChange,
  placeholder = 'Écrivez votre contenu en Markdown...',
  disabled = false,
  className,
  rows = 10,
  preview = 'live',
  previewOptions,
  ...props
}: MarkdownTextareaProps) {
  return (
    <div aria-invalid="true" className={cn(' relative w-full', className)}>
      <Suspense fallback={<div>Chargement...</div>}>
        <MDEditor
          id={id}
          value={value}
          onChange={(val) => onChange?.(val ?? '')}
          preview={preview}
          height={rows * 24}
          textareaProps={{ placeholder, disabled }}
          previewOptions={{
            remarkPlugins: [remarkBreaks],
            components: MarkdownComponents as any,
            ...previewOptions,
          }}
          {...props}
        />
      </Suspense>
    </div>
  )
}

export { MarkdownContent, MarkdownTextarea }
