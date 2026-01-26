<template>
  <div :class="cn('markdown-content', props.class)">
    <component :is="() => contentNodes" />
  </div>
</template>

<script setup lang="ts">
import { computed, h, type VNode } from 'vue'
import { marked, type Token } from 'marked'
import { Typography } from '@/shared/components/ui/typography'
import { LinkText } from '@/shared/components/ui/LinkText'
import { cn } from '@/lib/utils'

interface Props {
  content: string
  class?: string
}

const props = defineProps<Props>()

marked.setOptions({
  breaks: true,
  gfm: true,
})

function generateId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function extractText(tokens: Token[]): string {
  return tokens
    .map((token) => {
      if (token.type === 'text') return token.text || ''
      if ('tokens' in token && token.tokens) return extractText(token.tokens)
      if ('text' in token) return token.text || ''
      return ''
    })
    .join('')
}

function renderToken(token: Token) {
  switch (token.type) {
    case 'heading': {
      const headingText = extractText(token.tokens || [])
      const headingId = generateId(headingText)

      return h(
        Typography,
        {
          variant: `h${token.depth}` as any,
          class: 'mb-4 mt-8 first:mt-0 scroll-mt-20',
          id: headingId,
        },
        {
          default: () => [
            h(
              'a',
              {
                href: `#${headingId}`,
                class: 'group inline-flex items-center gap-2 no-underline hover:underline',
              },
              [
                ...renderTokens(token.tokens || []),
                h(
                  'span',
                  {
                    'class':
                      'opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground',
                    'aria-hidden': 'true',
                  },
                  '#'
                ),
              ]
            ),
          ],
        }
      )
    }

    case 'paragraph':
      return h(
        Typography,
        {
          variant: 'p',
          class: 'mb-4 leading-7',
        },
        { default: () => renderTokens(token.tokens || []) }
      )

    case 'blockquote':
      return h(
        Typography,
        {
          variant: 'blockquote',
          class: 'mb-4',
        },
        { default: () => renderTokens(token.tokens || []) }
      )

    case 'list': {
      const listItems = token.items.map((item: any) =>
        h('li', { class: 'mt-2' }, renderTokens(item.tokens || []))
      )
      return h(
        token.ordered ? 'ol' : 'ul',
        { class: 'my-6 ml-6 [&>li]:mt-2' + (token.ordered ? ' list-decimal' : ' list-disc') },
        listItems
      )
    }

    case 'code':
      return h(
        'pre',
        { class: 'my-6 overflow-x-auto rounded-lg border bg-muted p-4' },
        h('code', { class: 'relative font-mono text-sm' }, token.text)
      )

    case 'codespan':
      return h(Typography, { variant: 'code', as: 'code' }, { default: () => token.text })

    case 'strong':
      return h('strong', { class: 'font-semibold' }, renderTokens(token.tokens || []))

    case 'em':
      return h('em', { class: 'italic' }, renderTokens(token.tokens || []))

    case 'link':
      const isExternal = token.href.startsWith('http://') || token.href.startsWith('https://')
      return h(
        LinkText,
        {
          href: token.href,
          external: isExternal,
          title: token.title,
        },
        { default: () => renderTokens(token.tokens || []) }
      )

    case 'image':
      return h('img', {
        src: token.href,
        alt: token.text,
        title: token.title,
        class: 'my-6 rounded-lg shadow-md max-w-full h-auto',
      })

    case 'hr':
      return h('hr', { class: 'my-8 border-border' })

    case 'table': {
      const thead = h(
        'thead',
        { class: 'bg-muted' },
        h(
          'tr',
          token.header.map((cell: any) =>
            h(
              'th',
              { class: 'border border-border px-4 py-2 text-left font-semibold' },
              renderTokens(cell.tokens || [])
            )
          )
        )
      )
      const tbody = h(
        'tbody',
        token.rows.map((row: any, i: number) =>
          h(
            'tr',
            { class: i % 2 === 1 ? 'bg-muted/30' : '' },
            row.map((cell: any) =>
              h('td', { class: 'border border-border px-4 py-2' }, renderTokens(cell.tokens || []))
            )
          )
        )
      )
      return h(
        'div',
        { class: 'my-6 overflow-x-auto' },
        h('table', { class: 'w-full border-collapse' }, [thead, tbody])
      )
    }

    case 'space':
      return ''

    case 'text':
      if ('tokens' in token && token.tokens) {
        return renderTokens(token.tokens as Token[])
      }
      return token.text || ''

    case 'br':
      return h('br')

    case 'del':
      return h('del', { class: 'line-through' }, renderTokens(token.tokens || []))

    default:
      if ('text' in token) {
        return token.text || ''
      }
      return ''
  }
}

function renderTokens(tokens: Token[]): (VNode | string)[] {
  return tokens.map((token) => renderToken(token)).flat()
}

const contentNodes = computed(() => {
  if (!props.content) return []

  const tokens = marked.lexer(props.content)
  return renderTokens(tokens)
})
</script>

<style scoped>
.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.markdown-content :deep(table) {
  display: block;
  overflow-x: auto;
}

.markdown-content :deep(input[type='checkbox']) {
  margin-right: 0.5em;
}
</style>
