type DiscordAllowedMentionTypes = 'roles' | 'users' | 'everyone'

export interface DiscordAllowedMentions {
  parse?: DiscordAllowedMentionTypes[]
  roles?: string[]
  users?: string[]
  replied_user?: boolean
}
