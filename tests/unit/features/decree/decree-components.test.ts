import type { APIMessageTopLevelComponent } from 'discord-api-types/v10'
import { ComponentType, SeparatorSpacingSize } from 'discord-api-types/v10'
import { describe, expect, it } from 'vitest'
import { mapMessageComponents } from '#/features/decree/server/decree-components.ts'

describe('mapMessageComponents', () => {
  it('drops Discord role mentions', () => {
    const blocks = mapMessageComponents([
      { type: ComponentType.TextDisplay, content: '<@&1071282941826703370>' },
      { type: ComponentType.TextDisplay, content: 'Contenu du décret' },
    ])

    expect(blocks).toEqual([{ kind: 'text', content: 'Contenu du décret' }])
  })

  it('drops empty text displays', () => {
    const blocks = mapMessageComponents([{ type: ComponentType.TextDisplay, content: '   ' }])

    expect(blocks).toEqual([])
  })

  it('flattens containers into sibling blocks', () => {
    const blocks = mapMessageComponents([
      {
        type: ComponentType.Container,
        accent_color: 15481602,
        components: [
          { type: ComponentType.TextDisplay, content: 'Premier paragraphe' },
          { type: ComponentType.TextDisplay, content: 'Deuxième paragraphe' },
        ],
      },
    ])

    expect(blocks).toEqual([
      { kind: 'text', content: 'Premier paragraphe' },
      { kind: 'text', content: 'Deuxième paragraphe' },
    ])
  })

  it('maps media galleries', () => {
    const blocks = mapMessageComponents([
      {
        type: ComponentType.MediaGallery,
        items: [
          {
            media: { url: 'https://i.imgur.com/TF09sUC.png', width: 500, height: 533 },
            description: 'Sceau',
          },
          { media: { url: 'https://i.imgur.com/other.png' }, description: null },
        ],
      },
    ])

    expect(blocks).toEqual([
      {
        kind: 'media',
        items: [
          {
            url: 'https://i.imgur.com/TF09sUC.png',
            description: 'Sceau',
            width: 500,
            height: 533,
          },
          {
            url: 'https://i.imgur.com/other.png',
            description: null,
            width: null,
            height: null,
          },
        ],
      },
    ])
  })

  it('maps separators and their spacing', () => {
    const blocks = mapMessageComponents([
      { type: ComponentType.Separator, divider: true, spacing: SeparatorSpacingSize.Small },
      { type: ComponentType.Separator, divider: false, spacing: SeparatorSpacingSize.Large },
      { type: ComponentType.Separator },
    ])

    expect(blocks).toEqual([
      { kind: 'separator', divider: true, spacing: 'small' },
      { kind: 'separator', divider: false, spacing: 'large' },
      { kind: 'separator', divider: true, spacing: 'small' },
    ])
  })

  it('maps sections with their thumbnail accessory', () => {
    const blocks = mapMessageComponents([
      {
        type: ComponentType.Section,
        components: [{ type: ComponentType.TextDisplay, content: '+Edmund cardinal HENNESSY' }],
        accessory: {
          type: ComponentType.Thumbnail,
          media: {
            url: 'https://i.imgur.com/TEbG0MA.png',
            width: 1235,
            height: 1274,
          },
          description: null,
        },
      },
    ])

    expect(blocks).toEqual([
      {
        kind: 'section',
        content: '+Edmund cardinal HENNESSY',
        accessory: {
          url: 'https://i.imgur.com/TEbG0MA.png',
          description: null,
          width: 1235,
          height: 1274,
        },
      },
    ])
  })

  it('maps sections without accessory', () => {
    const blocks = mapMessageComponents([
      {
        type: ComponentType.Section,
        components: [{ type: ComponentType.TextDisplay, content: 'Sans vignette' }],
        accessory: {
          type: ComponentType.Button,
          label: 'Bouton',
          style: 1,
          custom_id: 'noop',
        },
      },
    ])

    expect(blocks).toEqual([{ kind: 'section', content: 'Sans vignette', accessory: null }])
  })

  it('ignores unsupported components', () => {
    const components = [
      {
        type: ComponentType.ActionRow,
        components: [{ type: ComponentType.Button, label: 'Bouton', style: 1 }],
      },
      { type: ComponentType.File, file: { url: 'attachment://decret.pdf' } },
    ] as unknown as APIMessageTopLevelComponent[]

    expect(mapMessageComponents(components)).toEqual([])
  })
})
