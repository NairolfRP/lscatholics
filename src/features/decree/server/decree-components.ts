import type {
  APIComponentInContainer,
  APIMessageTopLevelComponent,
  APISectionComponent,
  APIUnfurledMediaItem,
} from 'discord-api-types/v10'
import { ComponentType, SeparatorSpacingSize } from 'discord-api-types/v10'
import type { DecreeBlock, DecreeMedia } from '#/features/decree/types/decree.types.ts'

const ROLE_MENTION = /^<@&\d+>$/

type MappableComponent = APIMessageTopLevelComponent | APIComponentInContainer

/**
 * Normalizes a Discord components v2 payload into flat, renderable blocks.
 * Containers are flattened: their children become sibling blocks.
 */
export function mapMessageComponents(components: APIMessageTopLevelComponent[]): DecreeBlock[] {
  const blocks: DecreeBlock[] = []

  for (const component of components) {
    pushComponent(blocks, component)
  }

  return blocks
}

function pushComponent(blocks: DecreeBlock[], component: MappableComponent): void {
  switch (component.type) {
    case ComponentType.TextDisplay: {
      const content = component.content.trim()
      if (content.length === 0 || ROLE_MENTION.test(content)) return
      blocks.push({ kind: 'text', content: component.content })
      return
    }

    case ComponentType.Container: {
      for (const child of component.components) {
        pushComponent(blocks, child)
      }
      return
    }

    case ComponentType.MediaGallery: {
      const items = component.items
        .map((item) => toMedia(item.media, item.description))
        .filter((item) => item.url.length > 0)
      if (items.length > 0) blocks.push({ kind: 'media', items })
      return
    }

    case ComponentType.Separator: {
      blocks.push({
        kind: 'separator',
        divider: component.divider ?? true,
        spacing: component.spacing === SeparatorSpacingSize.Large ? 'large' : 'small',
      })
      return
    }

    case ComponentType.Section: {
      const section = toSection(component)
      if (section !== null) blocks.push(section)
      return
    }

    default:
      return
  }
}

function toSection(section: APISectionComponent): DecreeBlock | null {
  const content = section.components
    .map((child) => child.content.trim())
    .filter((child) => child.length > 0 && !ROLE_MENTION.test(child))
    .join('\n')

  const accessory =
    section.accessory.type === ComponentType.Thumbnail
      ? toMedia(section.accessory.media, section.accessory.description)
      : null

  if (content.length === 0 && accessory === null) return null

  return { kind: 'section', content, accessory }
}

function toMedia(media: APIUnfurledMediaItem, description?: string | null): DecreeMedia {
  return {
    url: media.url,
    description: description ?? null,
    width: media.width ?? null,
    height: media.height ?? null,
  }
}
