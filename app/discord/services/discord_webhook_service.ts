import type { DiscordAllowedMentions } from '#discord/types/interfaces/entities/discord_allowed_mentions'
import type { DiscordEmbed } from '#discord/types/interfaces/entities/discord_embed'
import type { DiscordFlag } from '#discord/types/interfaces/entities/discord_flags'
import type { DiscordPoll } from '#discord/types/interfaces/entities/discord_poll'
import {
  createDiscordWebhookUrlValidator,
  createDiscordWebhookValidator,
} from '#discord/validators/discord_webhook'
import { errors as vineErrors } from '@vinejs/vine'
import DiscordWebhookException from '#discord/exceptions/discord_webhook_exception'
import logger from '@adonisjs/core/services/logger'

const DISCORD_LIMITS = {
  MAX_EMBEDS: 10,
  MAX_CONTENT_LENGTH: 2000,
  MAX_EMBED_TITLE_LENGTH: 256,
  MAX_EMBED_DESCRIPTION_LENGTH: 4096,
  REQUEST_TIMEOUT: 10_000,
} as const

type DiscordWebhookServiceInitProps = {
  url: string
  timeout?: number
  retries?: number
}

export type DiscordWebhookOptions = {
  waitServerConfirmation?: boolean
  username?: string
  avatarUrl?: string
  allowedMentions?: DiscordAllowedMentions
  flags?: (typeof DiscordFlag)[]
  tts?: boolean
  thread?: {
    id?: string | number
    name?: string
    tags?: string[]
  }
}

export type WebhookExecutionResult = {
  success: boolean
  error?: string
  data?: {
    type: number
    content: string
    mention_roles: string[]
    attachments: any[]
    embeds: DiscordEmbed[]
    timestamp: string
    edited_timestamp: string | null
    flags: number
    components: any[]
    id: string
    channel_id: string
    author: {
      id: string
      username: string
      avatar: string | null
      discriminator: string
      public_flags: number
      flags: number
      bot: boolean
      global_name: string | null
      clan: string | null
      primary_guild: string | null
    }
    pinned: boolean
    mention_everyone: boolean
    tts: boolean
    webhook_id: boolean
    position: number
  }
}

export class DiscordWebhookService {
  readonly #url: string
  readonly #timeout: number
  readonly #retries: number

  #threadId: number | string | undefined
  #waitServerConfirmation: boolean = false

  #attachments: Record<string, any>[] = []
  #allowedMentions: DiscordAllowedMentions | undefined

  #components: any[] = []
  #content: string = ' '
  #embeds: DiscordEmbed[] = []
  #files: any | undefined
  #flags: (typeof DiscordFlag)[] | undefined

  #threadName: string | undefined
  #threadTags: string[] = []

  #tts: boolean = false
  #poll: DiscordPoll | undefined

  #username: string | undefined
  #avatarUrl: string | undefined

  private constructor({
    url,
    timeout = DISCORD_LIMITS.REQUEST_TIMEOUT,
    retries = 3,
  }: DiscordWebhookServiceInitProps) {
    this.#url = url
    this.#timeout = timeout
    this.#retries = retries
  }

  private lastExecutionTime: Date | null = null

  static async create({
    url,
    timeout = DISCORD_LIMITS.REQUEST_TIMEOUT,
    retries = 3,
  }: DiscordWebhookServiceInitProps) {
    const service = new DiscordWebhookService({ url, timeout, retries })

    try {
      await createDiscordWebhookUrlValidator.validate(url)
      return service
    } catch (e) {
      logger.error({ url }, 'Invalid Discord webhook URL provided')
      throw new DiscordWebhookException('Invalid webhook URL', true)
    }
  }

  setContent(content: string) {
    if (content.length > DISCORD_LIMITS.MAX_CONTENT_LENGTH) {
      throw new DiscordWebhookException(
        `Content exceeds maximum length of ${DISCORD_LIMITS.MAX_CONTENT_LENGTH} characters`
      )
    }

    this.#content = content.trim()
    return this
  }

  setOptions(options: DiscordWebhookOptions) {
    const {
      waitServerConfirmation,
      username,
      avatarUrl,
      allowedMentions,
      flags,
      tts = false,
      thread,
    } = options

    this.#waitServerConfirmation = waitServerConfirmation || false
    this.#threadId = thread?.id
    this.#username = username
    this.#avatarUrl = avatarUrl
    this.#allowedMentions = allowedMentions
    this.#flags = flags
    this.#tts = tts

    this.#threadName = thread?.name
    this.#threadTags = thread?.tags || []

    return this
  }

  setPoll(poll: DiscordPoll) {
    this.#poll = poll

    return this
  }

  addEmbed(embed: DiscordEmbed) {
    if (this.#embeds.length >= DISCORD_LIMITS.MAX_EMBEDS) {
      throw new DiscordWebhookException(
        `Cannot add more than ${DISCORD_LIMITS.MAX_EMBEDS} embeds to a single message`
      )
    }

    this.#validateEmbed(embed)

    this.#embeds.push({ ...embed })

    return this
  }

  addEmbeds(embeds: DiscordEmbed[]) {
    for (const embed of embeds) {
      this.addEmbed(embed)
    }

    return this
  }

  addAttachment(attachment: Record<string, any>) {
    this.#attachments.push({ ...attachment })

    return this
  }

  addComponent(component: any) {
    this.#components.push(component)

    return this
  }

  clear(): this {
    this.#attachments = []
    this.#allowedMentions = undefined
    this.#threadTags = []
    this.#components = []
    this.#content = ''
    this.#embeds = []
    this.#files = undefined
    this.#flags = undefined
    this.#threadName = undefined
    this.#tts = false
    this.#poll = undefined
    this.#username = undefined
    this.#avatarUrl = undefined

    return this
  }

  getEmbedCount(): number {
    return this.#embeds.length
  }

  getContentLength(): number {
    return this.#content.length
  }

  hasContent(): boolean {
    return !!(
      this.#content.trim() ||
      this.#embeds.length > 0 ||
      (this.#attachments && this.#attachments?.length > 0) ||
      this.#poll
    )
  }

  async execute(): Promise<WebhookExecutionResult> {
    if (!this.hasContent()) {
      const error = 'Discord Webhook cannot send empty message'
      logger.warn(error)
      return { success: false, error }
    }

    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.#retries; attempt++) {
      try {
        const result = await this.#executeWithTimeout()

        this.lastExecutionTime = new Date()

        logger.info(
          {
            attempt,
            contentLength: this.#content.length,
            embedCount: this.#embeds.length,
          },
          'Discord webhook executed successfully'
        )

        return result
      } catch (e) {
        lastError = e as Error

        if (e instanceof DiscordWebhookException && e.isValidationError) {
          break
        }

        if (attempt < this.#retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000) // Exponential backoff, max 5s
          logger.warn(
            {
              error: e instanceof Error ? e.message : String(e),
            },
            `Discord webhook attempt %s failed, retrying in %s ms`,
            attempt,
            delay
          )
          await this.#sleep(delay)
        }
      }
    }

    const errorMessage = lastError?.message || 'Unknown error'
    logger.error(
      { err: errorMessage, retries: this.#retries },
      'Discord webhook failed after all retries'
    )

    return {
      success: false,
      error: errorMessage,
    }
  }

  getLastExecutionInfo(): { timestamp: Date } | null {
    return this.lastExecutionTime ? { timestamp: this.lastExecutionTime } : null
  }

  async #executeWithTimeout(): Promise<{
    success: boolean
    data?: WebhookExecutionResult['data']
  }> {
    const url = this.#buildFetchUrl()
    const payload = await this.#buildPayload()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.#timeout)

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      })

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`

        try {
          const errorData = (await response.json()) as { message: string | undefined }
          if (errorData.message) {
            errorMessage += ` - ${errorData.message}`
          }
        } catch {}

        throw new DiscordWebhookException(errorMessage)
      }

      if (!this.#waitServerConfirmation) {
        return { success: true }
      }

      const data = (await response.json()) as WebhookExecutionResult['data']

      return { success: true, data }
    } catch (e) {
      if (e instanceof TypeError && e.message.includes('aborted')) {
        throw new DiscordWebhookException(`Request timeout after ${this.#timeout}ms`)
      }
      throw e
    } finally {
      clearTimeout(timeoutId)
    }
  }

  #buildFetchUrl() {
    const url = new URL(this.#url)

    if (this.#waitServerConfirmation) {
      url.searchParams.set('wait', 'true')
    }

    if (this.#threadId !== undefined) {
      url.searchParams.set('thread_id', String(this.#threadId))
    }

    return url.toString()
  }

  async #buildPayload() {
    try {
      return await createDiscordWebhookValidator.validate({
        content: this.#content || undefined,
        username: this.#username,
        avatar_url: this.#avatarUrl,
        tts: this.#tts,
        embeds: this.#embeds.length > 0 ? this.#embeds : undefined,
        allowed_mentions: this.#allowedMentions,
        components: this.#components.length > 0 ? this.#components : undefined,
        files: this.#files,
        attachments: this.#attachments.length > 0 ? this.#attachments : undefined,
        flags: this.#flags,
        thread_name: this.#threadName,
        applied_tags: this.#threadTags.length > 0 ? this.#threadTags : undefined,
        poll: this.#poll,
      })
    } catch (e) {
      if (e instanceof vineErrors.E_VALIDATION_ERROR) {
        const validationMessages = Array.isArray(e.messages)
          ? e.messages.join(', ')
          : JSON.stringify(e.messages)

        logger.error({ err: e }, 'Discord webhook payload validation failed')

        throw new DiscordWebhookException(`Payload validation failed: ${validationMessages}`, true)
      }

      throw e
    }
  }

  #validateEmbed(embed: DiscordEmbed) {
    if (embed.title && embed.title.length > DISCORD_LIMITS.MAX_EMBED_TITLE_LENGTH) {
      throw new DiscordWebhookException(
        `Embed title exceeds maximum length of ${DISCORD_LIMITS.MAX_EMBED_TITLE_LENGTH} characters`
      )
    }

    if (
      embed.description &&
      embed.description.length > DISCORD_LIMITS.MAX_EMBED_DESCRIPTION_LENGTH
    ) {
      throw new DiscordWebhookException(
        `Embed description exceeds maximum length of ${DISCORD_LIMITS.MAX_EMBED_DESCRIPTION_LENGTH} characters`
      )
    }

    if (embed.fields) {
      if (embed.fields.length > 25) {
        throw new DiscordWebhookException('Embed cannot have more than 25 fields')
      }

      embed.fields.forEach((field, index) => {
        if (field.name.length > 256) {
          throw new DiscordWebhookException(`Embed field ${index} name exceeds 256 characters`)
        }
        if (field.value.length > 1024) {
          throw new DiscordWebhookException(`Embed field ${index} value exceeds 1024 characters`)
        }
      })
    }
  }

  #sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
