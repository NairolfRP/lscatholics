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
import ky, { HTTPError, isHTTPError, isTimeoutError, type KyInstance } from 'ky'
import { DISCORD_LIMITS } from '#discord/constants/discord_webhook.constants'
import type {
  DiscordWebhookOptions,
  DiscordWebhookServiceInitProps,
  WebhookExecutionResult,
} from '#discord/types/discord_webhook.types'
import type { RESTError, RESTRateLimit } from 'discord-api-types/v10'

export class DiscordWebhookService {
  readonly #url: string
  readonly #timeout: number
  readonly #kyInstance: KyInstance

  #lastExecutionTime: Date | null = null
  #waitServerConfirmation: boolean = false

  #threadId: number | string | undefined

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
    retries = DISCORD_LIMITS.DEFAULT_RETRIES,
  }: DiscordWebhookServiceInitProps) {
    this.#url = url
    this.#timeout = timeout

    this.#kyInstance = ky.create({
      timeout,
      retry: {
        limit: retries,
        methods: ['post'],
        statusCodes: [408, 429, 500, 502, 503, 504],
        afterStatusCodes: [429],
        backoffLimit: 5_000,
      },

      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },

      hooks: {
        beforeRetry: [
          ({ error, retryCount }) => {
            logger.warn({ err: error }, `Discord webhook attempt ${retryCount} failed, retrying...`)
          },
        ],

        beforeError: [
          ({ request, error }) => {
            logger.error(
              {
                url: request.url,
                status: error instanceof HTTPError ? error.response.status : 'N/A',
                message: error.message,
              },
              'Discord webhook HTTP error after all retries'
            )
            return error
          },
        ],
      },
    })
  }

  static async create({
    url,
    timeout = DISCORD_LIMITS.REQUEST_TIMEOUT,
    retries = DISCORD_LIMITS.DEFAULT_RETRIES,
  }: DiscordWebhookServiceInitProps): Promise<DiscordWebhookService> {
    try {
      await createDiscordWebhookUrlValidator.validate(url)
    } catch (e) {
      logger.error({ url }, 'Invalid Discord webhook URL provided')
      throw new DiscordWebhookException('Invalid webhook URL', true)
    }

    return new DiscordWebhookService({ url, timeout, retries })
  }

  setContent(content: string): this {
    if (content.length > DISCORD_LIMITS.MAX_CONTENT_LENGTH) {
      throw new DiscordWebhookException(
        `Content exceeds maximum length of ${DISCORD_LIMITS.MAX_CONTENT_LENGTH} characters`
      )
    }

    this.#content = content.trim()
    return this
  }

  setOptions(options: DiscordWebhookOptions): this {
    const {
      waitServerConfirmation,
      username,
      avatarUrl,
      allowedMentions,
      flags,
      tts = false,
      thread,
    } = options

    this.#waitServerConfirmation = waitServerConfirmation ?? false
    this.#threadId = thread?.id
    this.#username = username
    this.#avatarUrl = avatarUrl
    this.#allowedMentions = allowedMentions
    this.#flags = flags
    this.#tts = tts
    this.#threadName = thread?.name
    this.#threadTags = thread?.tags ?? []

    return this
  }

  setPoll(poll: DiscordPoll): this {
    this.#poll = poll

    return this
  }

  addEmbed(embed: DiscordEmbed): this {
    if (this.#embeds.length >= DISCORD_LIMITS.MAX_EMBEDS) {
      throw new DiscordWebhookException(
        `Cannot add more than ${DISCORD_LIMITS.MAX_EMBEDS} embeds to a single message`
      )
    }

    this.#validateEmbed(embed)
    this.#embeds.push({ ...embed })

    return this
  }

  addEmbeds(embeds: DiscordEmbed[]): this {
    for (const embed of embeds) this.addEmbed(embed)
    return this
  }

  addAttachment(attachment: Record<string, any>): this {
    this.#attachments.push({ ...attachment })
    return this
  }

  addComponent(component: any): this {
    this.#components.push(component)
    return this
  }

  clear(): this {
    this.#attachments = []
    this.#allowedMentions = undefined
    this.#threadTags = []
    this.#components = []
    this.#content = ' '
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
      this.#attachments.length > 0 ||
      this.#poll
    )
  }

  getLastExecutionInfo(): { timestamp: Date } | null {
    return this.#lastExecutionTime ? { timestamp: this.#lastExecutionTime } : null
  }

  async execute(): Promise<WebhookExecutionResult> {
    if (!this.hasContent()) {
      const error = 'Discord Webhook cannot send empty message'
      logger.warn(error)
      return { success: false, error }
    }

    try {
      const payload = await this.#buildPayload()
      const result = await this.#executeRequest(payload)

      this.#lastExecutionTime = new Date()

      logger.info(
        { contentLength: this.#content.length, embedCount: this.#embeds.length },
        'Discord webhook executed successfully'
      )

      return result
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e)
      logger.error({ err: errorMessage }, 'Discord webhook failed')
      return { success: false, error: errorMessage }
    }
  }

  async #executeRequest(payload: unknown): Promise<WebhookExecutionResult> {
    try {
      const response = await this.#kyInstance.post(this.#url, {
        json: payload,
        searchParams: this.#buildSearchParams(),
      })

      if (!this.#waitServerConfirmation) {
        return { success: true }
      }

      const data = await response.json<NonNullable<WebhookExecutionResult['data']>>()
      return { success: true, data }
    } catch (e) {
      throw await this.#normalizeHttpError(e)
    }
  }

  async #normalizeHttpError(error: unknown): Promise<DiscordWebhookException> {
    if (error instanceof DiscordWebhookException) {
      return error
    }

    if (isTimeoutError(error)) {
      return new DiscordWebhookException(`Request timeout after ${this.#timeout}ms`)
    }

    if (isHTTPError(error)) {
      const { response, data } = error

      try {
        if (response.status === 429) {
          const body = data as RESTRateLimit
          return new DiscordWebhookException(
            `HTTP 429: Too Many Requests — ${body.message}`,
            false,
            body.retry_after * 1_000
          )
        }

        const body = data as RESTError
        const detail = body.message ?? response.statusText
        return new DiscordWebhookException(`HTTP ${response.status}: ${detail}`)
      } catch {
        return new DiscordWebhookException(`HTTP ${response.status}: ${response.statusText}`)
      }
    }

    const message = error instanceof Error ? error.message : String(error)
    return new DiscordWebhookException(message)
  }

  #buildSearchParams(): Record<string, string> {
    const params: Record<string, string> = {}

    if (this.#waitServerConfirmation) params['wait'] = 'true'
    if (this.#threadId !== undefined) params['thread_id'] = String(this.#threadId)

    return params
  }

  async #buildPayload() {
    try {
      return await createDiscordWebhookValidator.validate({
        content: this.#content || undefined,
        username: this.#username,
        avatar_url: this.#avatarUrl,
        tts: !this.#tts ? undefined : this.#tts,
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
        const messages = Array.isArray(e.messages)
          ? e.messages.join(', ')
          : JSON.stringify(e.messages)
        logger.error({ err: e }, 'Discord webhook payload validation failed')
        throw new DiscordWebhookException(`Payload validation failed: ${messages}`, true)
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

    if (!embed.fields) return

    if (embed.fields.length > DISCORD_LIMITS.MAX_EMBED_FIELDS) {
      throw new DiscordWebhookException(
        `Embed cannot have more than ${DISCORD_LIMITS.MAX_EMBED_FIELDS} fields`
      )
    }

    for (const [index, field] of embed.fields.entries()) {
      if (field.name.length > DISCORD_LIMITS.MAX_EMBED_FIELD_NAME_LENGTH) {
        throw new DiscordWebhookException(
          `Embed field ${index} name exceeds ${DISCORD_LIMITS.MAX_EMBED_FIELD_NAME_LENGTH} characters`
        )
      }
      if (field.value.length > DISCORD_LIMITS.MAX_EMBED_FIELD_VALUE_LENGTH) {
        throw new DiscordWebhookException(
          `Embed field ${index} value exceeds ${DISCORD_LIMITS.MAX_EMBED_FIELD_VALUE_LENGTH} characters`
        )
      }
    }
  }
}
