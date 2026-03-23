import app from '@adonisjs/core/services/app'
import { ExceptionHandler, type HttpContext } from '@adonisjs/core/http'
import type { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'
import env from '#start/env'
import { DiscordWebhookService } from '#discord/services/discord_webhook_service'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * Status pages are used to display a custom HTML pages for certain error
   * codes. You might want to enable them in production only, but feel
   * free to enable them in development as well.
   */
  protected renderStatusPages = app.inProduction

  /**
   * Status pages is a collection of error code range and a callback
   * to return the HTML contents to send as a response.
   */
  protected statusPages: Record<StatusPageRange, StatusPageRenderer> = {
    '404': (_, { inertia }) => inertia.render('errors/not-found', {}),
    '500..599': (_, { inertia }) => inertia.render('errors/server-error', {}),
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    return super.handle(error, ctx)
  }

  protected context(ctx: HttpContext) {
    return {
      /**
       * Include the unique request ID for tracking
       * this specific request across logs
       */
      requestId: ctx.request.id(),

      /**
       * Add the authenticated user's ID if available
       * to identify which user encountered the error
       */
      userId: ctx.auth.user?.id,
      currentCharacter: ctx.auth.user ? ctx.characters.getCurrentCharacter() : 'unauthenticated',
    }
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    /**
     * First call the parent report method to ensure
     * the error is logged using the default behavior
     */
    await super.report(error, ctx)

    /**
     * Discord webhook reporting logic - only in production environment
     */
    const webhookUrl = env.get('ERROR_REPORTING_WEBHOOK')

    if (!webhookUrl || !app.inProduction) return

    const reportContent = JSON.stringify(error, null, 4)

    const discordWebhook = await DiscordWebhookService.create({ url: webhookUrl })

    await discordWebhook.setContent(reportContent).execute()
  }
}
