import { Fragment, useMemo } from 'react'
import { parseReadingContent } from '#/features/daily-readings/utils/readings.utils.ts'
import type {
  ReadingBlockNode,
  ReadingInlineNode,
} from '#/features/daily-readings/utils/readings.utils.ts'
import { cn } from '#/shared/lib/utils.ts'

type ReadingContentVariant = 'prose' | 'poetry'

export function ReadingContent({
  html,
  variant = 'prose',
  className,
}: {
  html: string
  variant?: ReadingContentVariant
  className?: string
}) {
  const blocks = useMemo(() => parseReadingContent(html), [html])

  return (
    <div className={cn(variant === 'poetry' && 'space-y-4', className)}>
      {blocks.map((block, index) => (
        <BlockNode key={index} block={block} variant={variant} />
      ))}
    </div>
  )
}

function BlockNode({
  block,
  variant,
}: {
  block: ReadingBlockNode
  variant: ReadingContentVariant
}) {
  if (block.type === 'paragraph') {
    return (
      <p
        className={cn(
          'leading-7 text-pretty',
          variant === 'poetry' && 'border-l-2 border-foreground/10 pl-4'
        )}
      >
        <InlineNodes nodes={block.children} />
      </p>
    )
  }

  return <InlineNodes nodes={block.children} />
}

function InlineNodes({ nodes }: { nodes: ReadingInlineNode[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        switch (node.type) {
          case 'text':
            return <Fragment key={index}>{node.text}</Fragment>
          case 'br':
            return <br key={index} />
          case 'strong':
            return (
              <strong key={index} className="font-semibold">
                <InlineNodes nodes={node.children} />
              </strong>
            )
          case 'em':
            return (
              <em key={index}>
                <InlineNodes nodes={node.children} />
              </em>
            )
        }
      })}
    </>
  )
}
