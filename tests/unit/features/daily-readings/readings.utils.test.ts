import { describe, expect, it } from 'vitest'
import { toISODate } from '#/features/daily-readings/schemas/daily-readings.schema.ts'
import type {
  AELFReadingsMetadata,
  AELFReading,
} from '#/features/daily-readings/types/aelf.types.ts'
import {
  decodeHtmlEntities,
  getLiturgicalColorHex,
  getLiturgicalColorName,
  getLiturgicalHeader,
  getReadingTypeLabel,
  parseInlineNodes,
  parseReadingContent,
  parseISODate,
  sortReadings,
} from '#/features/daily-readings/utils/readings.utils.ts'

const baseReading = (
  overrides: Partial<Pick<AELFReading, 'type' | 'ref' | 'titre'>> = {}
): AELFReading => ({
  type: 'lecture_1',
  refrain_psalmique: null,
  ref_refrain: null,
  titre: null,
  contenu: '<p>Contenu.</p>',
  ref: 'Gn 1, 1-5',
  intro_lue: null,
  verset_evangile: null,
  ref_verset: null,
  ...overrides,
})

describe('sortReadings', () => {
  it('orders readings according to the liturgy', () => {
    const readings = [
      baseReading({ type: 'evangile', ref: 'Mt 15, 21-28' }),
      baseReading({ type: 'lecture_2', ref: 'Rm 9, 1-5' }),
      baseReading({ type: 'lecture_1', ref: 'Jr 31, 1-7' }),
      baseReading({ type: 'psaume', ref: 'Ps 84, 9-14' }),
    ]

    expect(sortReadings(readings).map((r) => r.type)).toEqual([
      'lecture_1',
      'psaume',
      'lecture_2',
      'evangile',
    ])
  })

  it('keeps the cantique type after the first reading', () => {
    const readings = [
      baseReading({ type: 'evangile' }),
      baseReading({ type: 'cantique' }),
      baseReading({ type: 'lecture_1' }),
    ]

    expect(sortReadings(readings).map((r) => r.type)).toEqual(['lecture_1', 'cantique', 'evangile'])
  })

  it('drops unknown types', () => {
    const readings = [baseReading({ type: 'epitre' }), baseReading({ type: 'evangile' })]

    expect(sortReadings(readings).map((r) => r.type)).toEqual(['evangile'])
  })

  it('preserves duplicate types (long and short form of the gospel)', () => {
    const readings = [
      baseReading({ type: 'evangile', ref: 'Lc 2, 1-14' }),
      baseReading({ type: 'evangile', ref: 'Lc 2, 1-7' }),
    ]

    expect(sortReadings(readings).map((r) => r.ref)).toEqual(['Lc 2, 1-14', 'Lc 2, 1-7'])
  })
})

describe('getReadingTypeLabel', () => {
  it('maps known types to their French label', () => {
    expect(getReadingTypeLabel('lecture_1')).toBe('Première lecture')
    expect(getReadingTypeLabel('psaume')).toBe('Psaume')
    expect(getReadingTypeLabel('cantique')).toBe('Cantique')
    expect(getReadingTypeLabel('lecture_2')).toBe('Deuxième lecture')
    expect(getReadingTypeLabel('evangile')).toBe('Évangile')
  })

  it('returns null for unknown types', () => {
    expect(getReadingTypeLabel('epitre')).toBeNull()
  })
})

describe('getLiturgicalHeader', () => {
  const baseInfo: AELFReadingsMetadata = {
    date: '2026-08-05',
    zone: 'romain',
    couleur: 'vert',
    annee: 'Paire',
    temps_liturgique: 'ordinaire',
    semaine: '18ème Semaine du Temps Ordinaire',
    jour: 'mercredi',
    jour_liturgique_nom: 'de la férie',
    fete: 'Dédicace de la Basilique Sainte-Marie Majeure',
    degre: '',
    ligne1: 'mercredi, 18ème Semaine du Temps Ordinaire',
    ligne2: 'Dédicace de la Basilique Sainte-Marie Majeure',
    ligne3: 'Mémoire facultative',
    couleur2: 'blanc',
    couleur3: '',
  }

  it('parses the date locally without UTC offset', () => {
    const header = getLiturgicalHeader(baseInfo)

    expect(header.date.getFullYear()).toBe(2026)
    expect(header.date.getMonth()).toBe(7)
    expect(header.date.getDate()).toBe(5)
    expect(header.weekday).toBe('Mercredi')
    expect(header.formattedDate).toBe('5 août 2026')
  })

  it('strips the leading weekday from the main name and keeps the sub-lines', () => {
    const header = getLiturgicalHeader(baseInfo)

    expect(header.mainName).toBe('18ème Semaine du Temps Ordinaire')
    expect(header.subLines).toEqual([
      { label: 'Dédicace de la Basilique Sainte-Marie Majeure', color: 'blanc' },
      { label: 'Mémoire facultative', color: null },
    ])
    expect(header.semaine).toBe('18ème Semaine du Temps Ordinaire')
    expect(header.annee).toBe('Paire')
  })

  it('uses the celebration name directly for feasts', () => {
    const header = getLiturgicalHeader({
      ...baseInfo,
      date: '2026-08-06',
      jour_liturgique_nom: 'Transfiguration du Seigneur',
      fete: 'Fête',
      degre: 'Fête du Seigneur',
      semaine: null,
      jour: null,
      ligne1: 'Transfiguration du Seigneur',
      ligne2: 'Fête',
      ligne3: '',
      couleur: 'blanc',
      couleur2: '',
    })

    expect(header.mainName).toBe('Transfiguration du Seigneur')
    expect(header.subLines).toEqual([{ label: 'Fête', color: null }])
    expect(header.semaine).toBeNull()
  })

  it('deduplicates sub-lines identical to the main name', () => {
    const header = getLiturgicalHeader({
      ...baseInfo,
      ligne2: '18ème Semaine du Temps Ordinaire',
      ligne3: '18ème Semaine du Temps Ordinaire',
    })

    expect(header.subLines).toEqual([])
  })

  it('attaches each secondary color to its celebration line', () => {
    const header = getLiturgicalHeader({
      ...baseInfo,
      ligne2: 'Dédicace de la Basilique Sainte-Marie Majeure',
      ligne3: 'Sainte Anne, mère de la Vierge Marie',
      couleur2: 'rouge',
      couleur3: 'blanc',
    })

    expect(header.subLines).toEqual([
      { label: 'Dédicace de la Basilique Sainte-Marie Majeure', color: 'rouge' },
      { label: 'Sainte Anne, mère de la Vierge Marie', color: 'blanc' },
    ])
  })

  it('falls back to the liturgical name when ligne1 is empty', () => {
    const header = getLiturgicalHeader({ ...baseInfo, ligne1: '' })

    expect(header.mainName).toBe('de la férie')
  })
})

describe('liturgical colors', () => {
  it('maps French and English color names to hex values, case-insensitively', () => {
    expect(getLiturgicalColorHex('vert')).toBe('#16a34a')
    expect(getLiturgicalColorHex('Green')).toBe('#16a34a')
    expect(getLiturgicalColorHex('rouge')).toBe('#dc2626')
    expect(getLiturgicalColorHex(null)).toBeNull()
    expect(getLiturgicalColorHex('turquoise')).toBeNull()
  })

  it('maps color names to their French label', () => {
    expect(getLiturgicalColorName('blanc')).toBe('Blanc')
    expect(getLiturgicalColorName('vert')).toBe('Vert')
    expect(getLiturgicalColorName(null)).toBeNull()
  })
})

describe('decodeHtmlEntities', () => {
  it('decodes named and numeric entities', () => {
    expect(decodeHtmlEntities('a&nbsp;b &amp; c &lt;d&gt; &#39;quotes&#39; &quot;q&quot;')).toBe(
      'a b & c <d> \'quotes\' "q"'
    )
  })

  it('decodes numeric hex entities', () => {
    expect(decodeHtmlEntities('&#x2019;')).toBe('\u2019')
  })

  it('leaves unknown entities untouched', () => {
    expect(decodeHtmlEntities('&unknown;')).toBe('&unknown;')
  })
})

describe('parseInlineNodes', () => {
  it('parses strong, em and br into a tree', () => {
    expect(parseInlineNodes('Avant <strong>gras <em>italique</em></strong> après.')).toEqual([
      { type: 'text', text: 'Avant ' },
      {
        type: 'strong',
        children: [
          { type: 'text', text: 'gras ' },
          { type: 'em', children: [{ type: 'text', text: 'italique' }] },
        ],
      },
      { type: 'text', text: ' après.' },
    ])
  })

  it('turns line breaks into br nodes', () => {
    expect(parseInlineNodes('une ligne<br />deuxième ligne')).toEqual([
      { type: 'text', text: 'une ligne' },
      { type: 'br' },
      { type: 'text', text: 'deuxième ligne' },
    ])
  })

  it('decodes entities and tolerates a dangling closing tag', () => {
    expect(parseInlineNodes('<em>Réponds&nbsp;moi</em></strong> fin.')).toEqual([
      { type: 'em', children: [{ type: 'text', text: 'Réponds moi' }] },
      { type: 'text', text: ' fin.' },
    ])
  })
})

describe('parseReadingContent', () => {
  it('splits <p> blocks into paragraphs', () => {
    const blocks = parseReadingContent(
      '<p>Premier paragraphe.</p><p>Deuxième <strong>paragraphe</strong>.</p>'
    )

    expect(blocks).toEqual([
      { type: 'paragraph', children: [{ type: 'text', text: 'Premier paragraphe.' }] },
      {
        type: 'paragraph',
        children: [
          { type: 'text', text: 'Deuxième ' },
          { type: 'strong', children: [{ type: 'text', text: 'paragraphe' }] },
          { type: 'text', text: '.' },
        ],
      },
    ])
  })

  it('keeps content outside <p> as inline blocks', () => {
    const blocks = parseReadingContent('R/ Seigneur, prends pitié.<p>Versets.</p>')

    expect(blocks).toEqual([
      { type: 'inline', children: [{ type: 'text', text: 'R/ Seigneur, prends pitié.' }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'Versets.' }] },
    ])
  })

  it('returns an empty array for empty or plain text input', () => {
    expect(parseReadingContent('')).toEqual([])
    expect(parseReadingContent('   \n  ')).toEqual([])
    expect(parseReadingContent('<p></p>')).toEqual([])
  })

  it('parses a realistic psalm refrain payload', () => {
    const blocks = parseReadingContent(
      '<p><strong>Fais-nous voir, Seigneur, ton amour,<br />et donne-nous ton salut.</strong></p>'
    )

    expect(blocks).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'strong',
            children: [
              { type: 'text', text: 'Fais-nous voir, Seigneur, ton amour,' },
              { type: 'br' },
              { type: 'text', text: 'et donne-nous ton salut.' },
            ],
          },
        ],
      },
    ])
  })
})

describe('date helpers', () => {
  it('round-trips through toISODate and parseISODate', () => {
    const date = new Date(2026, 7, 5)
    const iso = toISODate(date)

    expect(iso).toBe('2026-08-05')
    expect(parseISODate(iso)).toEqual(date)
  })
})
