import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import BaseInertiaMiddleware from '@adonisjs/inertia/inertia_middleware'
import UserTransformer from '#users/transformers/user_transformer'

export default class InertiaMiddleware extends BaseInertiaMiddleware {
  share(ctx: HttpContext) {
    /**
     * The share method is called every time an Inertia page is rendered. In
     * certain cases, a page may get rendered before the session middleware
     * or the auth middleware are executed. For example: During a 404 request.
     *
     * In that case, we must always assume that HttpContext is not fully hydrated
     * with all the properties.
     */
    const { session, auth } = ctx as Partial<HttpContext>

    /**
     * Fetching the first error from the flash messages
     */
    const errorsBag = session?.flashMessages.get('errorsBag') ?? {}
    const error: string | undefined = Object.keys(errorsBag)
      .filter((code) => code !== 'E_VALIDATION_ERROR')
      .map((code) => errorsBag[code])[0]

    /**
     * Data shared with all Inertia pages. Make sure you are using
     * transformers for rich data-types like Models.
     */
    return {
      currentRoute: ctx.inertia.always(ctx.route?.name), // temporary shared prop - waiting for the 'current' property to be added back to Tuyau
      url: ctx.inertia.always(ctx.request.completeUrl()),
      errors: ctx.inertia.always(this.getValidationErrors(ctx)),
      success: ctx.inertia.always(ctx.session?.flashMessages.get('success')),
      flash: ctx.inertia.always({
        error: error,
        success: session?.flashMessages.get('success'),
      }),
      user: ctx.inertia.always(
        auth?.user
          ? UserTransformer.transform(auth.user).useVariant('userWithCurrentCharacter')
          : undefined
      ),
    }
  }

  async handle(ctx: HttpContext, next: NextFn) {
    await this.init(ctx)

    const output = await next()
    this.dispose(ctx)

    return output
  }
}

declare module '@adonisjs/inertia/types' {
  type MiddlewareSharedProps = InferSharedProps<InertiaMiddleware>
  export interface SharedProps extends MiddlewareSharedProps {}
}
