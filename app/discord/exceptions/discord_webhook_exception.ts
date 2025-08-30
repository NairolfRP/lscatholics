import { Exception } from '@adonisjs/core/exceptions'

export default class DiscordWebhookException extends Exception {
  constructor(
    message: string,
    public isValidationError = false
  ) {
    super(message)
  }
}
