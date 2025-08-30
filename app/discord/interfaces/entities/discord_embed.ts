type DiscordEmbedMedia = {
  url?: string
  proxy_url?: string
  height?: number
  width?: number
}

type DiscordEmbedFooter = {
  text: string
  icon_url?: string
  proxy_icon_url?: string
}

type DiscordEmbedProvider = {
  name?: string
  url?: string
}

type DiscordEmbedAuthor = {
  name: string
  url?: string
  icon_url?: string
  proxy_icon_url?: string
}

type DiscordEmbedField = {
  name: string
  value: string
  inline?: boolean
}

interface DiscordEmbedVideo extends DiscordEmbedMedia {}
interface DiscordEmbedImage extends DiscordEmbedMedia {
  url: string
}
interface DiscordEmbedThumbnail extends DiscordEmbedMedia {
  url: string
}

export interface DiscordEmbed {
  title?: string
  type?: 'rich' | 'image' | 'video' | 'gifv' | 'article' | 'link' | 'poll_result'
  description?: string
  url?: string
  timestamp?: string
  color?: number
  footer?: DiscordEmbedFooter
  image?: DiscordEmbedImage
  thumbnail?: DiscordEmbedThumbnail
  video?: DiscordEmbedVideo
  provider?: DiscordEmbedProvider
  author?: DiscordEmbedAuthor
  fields?: DiscordEmbedField[]
}
