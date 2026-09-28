import { test } from 'vitest'
import { createSlug, generateExcerpt, parseCsvString } from '#/utils/string'

const title = 'Bénédiction de la nouvelle église Saint-Michel à Los Santos — 2025 !'

const markdown = `# Célébration du dimanche

Bienvenue à la **messe dominicale** de la paroisse *Saint-Michel*.

Voici les [informations pratiques](https://example.com) et une image ![affiche](img.png).

- Horaire: 10h00
- Lieu: Cathédrale

> Que la paix soit avec vous.

\`\`\`
un bloc de code ignoré
\`\`\`

Rejoignez-nous pour ce moment de recueillement et de partage fraternel.`.repeat(4)

const csv = 'admin, moderator ,  member,,guest,  visitor  ,priest'

test('createSlug', async ({ bench }) => {
  await bench.compare(
    bench('short title', () => {
      createSlug(title)
    }),
    bench('long title', () => {
      createSlug(title.repeat(20))
    })
  )
})

test('generateExcerpt', async ({ bench }) => {
  await bench.compare(
    bench('markdown to 160 char excerpt', () => {
      generateExcerpt(markdown, 160)
    }),
    bench('markdown to 320 char excerpt', () => {
      generateExcerpt(markdown, 320)
    })
  )
})

test('parseCsvString', async ({ bench }) => {
  await bench('parse csv string', () => {
    parseCsvString(csv)
  }).run()
})
