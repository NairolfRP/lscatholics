import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    url: (ctx) => ctx.inertia.always(() => ctx.request.completeUrl()),
    user: (ctx) =>
      ctx.inertia.always(async () => {
        if (ctx.session?.has('auth_web')) {
          try {
            await ctx.auth.check()

            const currentCharacter = await ctx.characters.getCurrentCharacter()

            return {
              id: ctx.auth.user?.id,
              name: ctx.auth.user?.name,
              createdAt: ctx.auth.user?.createdAt,
              currentCharacter,
            }
          } catch (error) {
            return null
          }
        }

        return null
      }),
    success: (ctx) => ctx.inertia.always(() => ctx.session?.flashMessages.get('success')),
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: true,
    entrypoint: 'inertia/app/ssr.ts',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
