import type { DiscordEmoji } from '#types/discord/interfaces/entities/discord_emoji'

type DiscordPollMedia = {
  text?: string
  emoji?: Partial<DiscordEmoji>
}
type DiscordPollAnswer = {
  answer_id: number
  poll_media: DiscordPollMedia
}
type DiscordPollAnswerCount = {
  id: number
  count: number
  me_voted: boolean
}
type DiscordPollResults = {
  is_finalized: boolean
  answer_counts: DiscordPollAnswerCount[]
}

type DiscordPollLayoutType = 1

export interface DiscordPoll {
  question: DiscordPollMedia
  answers: DiscordPollAnswer[]
  expiry: number
  allow_multiselect: boolean
  layout_type: DiscordPollLayoutType
  results?: DiscordPollResults
}
