import {
  LITURGICAL_COLORS,
  READING_ORDER,
  READING_TYPE_LABELS,
} from '#/features/daily-readings/constants/readings.constants.ts'
import type {
  AELFReadingsMetadata,
  AELFReading,
  AELFReadingType,
} from '#/features/daily-readings/types/aelf.types.ts'

export interface LiturgicalSubLine {
  label: string
  color: string | null
}

export interface LiturgicalHeader {
  date: Date
  weekday: string
  formattedDate: string
  mainName: string
  subLines: LiturgicalSubLine[]
  semaine: string | null
  annee: string | null
  couleur: string | null
}

// ---------------------------------------------------------------------------
// Reading ordering / labels
// ---------------------------------------------------------------------------

export function getReadingTypeLabel(type: string): string | null {
  return READING_TYPE_LABELS[type as AELFReadingType] ?? null
}

/** Returns the readings in liturgical order, keeping unknown types out. */
export function sortReadings(readings: AELFReading[]): AELFReading[] {
  const order = new Map(READING_ORDER.map((type, index) => [type, index] as const))

  return readings
    .filter((reading) => order.has(reading.type as AELFReadingType))
    .sort(
      (a, b) =>
        (order.get(a.type as AELFReadingType) ?? 0) - (order.get(b.type as AELFReadingType) ?? 0)
    )
}

// ---------------------------------------------------------------------------
// Liturgical header
// ---------------------------------------------------------------------------

const WEEKDAY_NAMES = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

function stripLeadingWeekday(text: string): string {
  return text.replace(new RegExp(`^(?:${WEEKDAY_NAMES.join('|')})\\s*,\\s*`, 'i'), '')
}

export function parseISODate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const fullDateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function getLiturgicalHeader(info: AELFReadingsMetadata): LiturgicalHeader {
  const date = parseISODate(info.date)

  const mainName = stripLeadingWeekday(info.ligne1.trim() || info.jour_liturgique_nom.trim())

  const subLines: LiturgicalSubLine[] = []
  const seen = new Set<string>()
  for (const { label, color } of [
    { label: info.ligne2.trim(), color: info.couleur2.trim() || null },
    { label: info.ligne3.trim(), color: info.couleur3.trim() || null },
  ]) {
    if (label && label !== mainName && !seen.has(label)) {
      seen.add(label)
      subLines.push({ label, color })
    }
  }

  return {
    date,
    weekday: capitalize(new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(date)),
    formattedDate: fullDateFormatter.format(date),
    mainName,
    subLines,
    semaine: info.semaine?.trim() ? capitalize(info.semaine.trim()) : null,
    annee: info.annee?.trim() || null,
    couleur: info.couleur.trim() || null,
  }
}

export function getLiturgicalColorHex(color: string | null | undefined): string | null {
  if (!color) return null
  return LITURGICAL_COLORS[color.toLowerCase()]?.hex ?? null
}

export function getLiturgicalColorName(color: string | null | undefined): string | null {
  if (!color) return null
  return LITURGICAL_COLORS[color.toLowerCase()]?.name ?? null
}

// ---------------------------------------------------------------------------
// Reading HTML → AST (safe, no innerHTML)
// ---------------------------------------------------------------------------

export type ReadingInlineNode =
  | { type: 'text'; text: string }
  | { type: 'strong'; children: ReadingInlineNode[] }
  | { type: 'em'; children: ReadingInlineNode[] }
  | { type: 'br' }

type ReadingInlineContainer = Extract<ReadingInlineNode, { children: ReadingInlineNode[] }>

export type ReadingBlockNode =
  | { type: 'paragraph'; children: ReadingInlineNode[] }
  | { type: 'inline'; children: ReadingInlineNode[] }

type InlineToken =
  | { kind: 'text'; text: string }
  | { kind: 'open'; tag: 'strong' | 'em' }
  | { kind: 'close'; tag: 'strong' | 'em' }
  | { kind: 'br' }

const ENTITY_RE = /&(#\d+|#x[0-9a-f]+|[a-z]+);/gi

const HTML_ENTITIES: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
}

export function decodeHtmlEntities(text: string): string {
  return text.replace(ENTITY_RE, (match) => {
    const entity = match.slice(1, -1)
    if (entity[0] === '#') {
      const radix = entity[1].toLowerCase() === 'x' ? 16 : 10
      const code = Number.parseInt(entity.slice(radix === 16 ? 2 : 1), radix)
      return Number.isNaN(code) ? match : String.fromCodePoint(code)
    }
    return HTML_ENTITIES[entity.toLowerCase()] || match
  })
}

const INLINE_TAG_RE = /<(\/)?(strong|em|br)\b[^>]*>/gi

function tokenizeInline(html: string): InlineToken[] {
  const tokens: InlineToken[] = []
  let lastIndex = 0
  const re = new RegExp(INLINE_TAG_RE.source, INLINE_TAG_RE.flags)
  let match: RegExpExecArray | null

  while ((match = re.exec(html)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ kind: 'text', text: decodeHtmlEntities(html.slice(lastIndex, match.index)) })
    }

    const closing = match[1] === '/'
    const tag = match[2].toLowerCase()
    if (tag === 'br') {
      tokens.push({ kind: 'br' })
    } else if (closing) {
      tokens.push({ kind: 'close', tag: tag as 'strong' | 'em' })
    } else {
      tokens.push({ kind: 'open', tag: tag as 'strong' | 'em' })
    }

    lastIndex = re.lastIndex
  }

  if (lastIndex < html.length) {
    tokens.push({ kind: 'text', text: decodeHtmlEntities(html.slice(lastIndex)) })
  }

  return tokens
}

function findLastIndex<T>(items: T[], predicate: (item: T) => boolean): number {
  for (let i = items.length - 1; i >= 0; i--) {
    if (predicate(items[i])) return i
  }
  return -1
}

export function parseInlineNodes(html: string): ReadingInlineNode[] {
  const root: ReadingInlineNode[] = []
  const stack: ReadingInlineContainer[] = []

  const push = (node: ReadingInlineNode) => {
    if (stack.length > 0) {
      stack[stack.length - 1].children.push(node)
    } else {
      root.push(node)
    }
  }

  for (const token of tokenizeInline(html)) {
    if (token.kind === 'text') {
      if (token.text.trim()) push({ type: 'text', text: token.text })
    } else if (token.kind === 'br') {
      push({ type: 'br' })
    } else if (token.kind === 'open') {
      const container: ReadingInlineContainer =
        token.tag === 'strong' ? { type: 'strong', children: [] } : { type: 'em', children: [] }
      push(container)
      stack.push(container)
    } else {
      const index = findLastIndex(stack, (item) => item.type === token.tag)
      if (index >= 0) {
        stack.length = index
      }
    }
  }

  return root
}

const PARAGRAPH_RE = /<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi

export function parseReadingContent(html: string): ReadingBlockNode[] {
  const blocks: ReadingBlockNode[] = []
  const re = new RegExp(PARAGRAPH_RE.source, PARAGRAPH_RE.flags)
  let lastIndex = 0
  let match: RegExpExecArray | null

  const pushLeftover = (raw: string) => {
    const children = parseInlineNodes(raw)
    if (children.length > 0) blocks.push({ type: 'inline', children })
  }

  while ((match = re.exec(html)) !== null) {
    pushLeftover(html.slice(lastIndex, match.index))

    const children = parseInlineNodes(match[1])
    if (children.length > 0) blocks.push({ type: 'paragraph', children })

    lastIndex = re.lastIndex
  }

  pushLeftover(html.slice(lastIndex))

  return blocks
}
