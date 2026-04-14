import { Exception } from '@adonisjs/core/exceptions'

export default class DiscordWebhookException extends Exception {
  constructor(
    message: string,
    public readonly isValidationError = false,
    public readonly retryAfter?: number
  ) {
    super(message)
  }
}
