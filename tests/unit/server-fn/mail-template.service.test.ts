import { describe, expect, it } from 'vitest'
import { renderMailTemplate } from '#server/services/mail-template.service.ts'

describe('renderMailTemplate', () => {
  it('renders a full letter block', () => {
    const html = renderMailTemplate({
      logoUrl: 'https://i.imgur.com/logo.png',
      blocks: [
        {
          title: 'Archidiocèse de Los Santos',
          greeting: 'Bonjour <strong>Jean</strong>,',
          intro: 'Merci pour votre don de <strong>$50</strong>.',
          amountLabel: 'Montant du don',
          amount: '$50',
          paragraphs: ['Votre générosité est précieuse.'],
          blessing: 'Que la joie de Dieu vous comble !',
          close: 'Fraternellement,',
          signature: 'Archidiocèse',
          links: [{ label: 'Suivez-nous :', href: 'https://example.com' }],
          note: 'Message automatique.',
        },
      ],
    })

    expect(html).toContain('<img src="https://i.imgur.com/logo.png"')
    expect(html).toContain('>Archidiocèse de Los Santos</div>')
    expect(html).toContain('Bonjour <strong>Jean</strong>,')
    expect(html).toContain('Montant du don')
    expect(html).toContain('Votre générosité est précieuse.')
    expect(html).toContain('Que la joie de Dieu vous comble !')
    expect(html).toContain('Fraternellement,')
    expect(html).toContain('https://example.com')
  })

  it('omits optional sections when not provided', () => {
    const html = renderMailTemplate({
      blocks: [{ title: 'T', greeting: 'G', intro: 'I', paragraphs: [] }],
    })

    expect(html).not.toContain('Montant du don')
    expect(html).not.toContain('Que la joie de Dieu vous comble !')
    expect(html).not.toContain('Fraternellement,')
    expect(html).not.toContain('<a href=')
  })

  it('separates several blocks and uses no separator for a single one', () => {
    const single = renderMailTemplate({
      blocks: [{ title: 'One', greeting: 'G', intro: 'I', paragraphs: [] }],
    })
    const multiple = renderMailTemplate({
      blocks: [
        { title: 'One', greeting: 'G', intro: 'I', paragraphs: [] },
        { title: 'Two', greeting: 'G', intro: 'I', paragraphs: [] },
      ],
    })

    expect(single).not.toContain('❦')
    expect(multiple).toContain('❦')
  })
})
