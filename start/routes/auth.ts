import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router
  .group(() => {
    router.get('/redirect/gtaw', [controllers.auth.Auth, 'redirectToProvider']).as('signIn')
    router.get('/callback/gtaw', [controllers.auth.Auth, 'handleCallback'])
    router.post('/logout', [controllers.auth.Auth, 'logout']).use(middleware.auth()).as('logout')

    router
      .get('/redirect/discord', [controllers.auth.Auth, 'redirectToDiscord'])
      .use(middleware.auth())
      .as('discord.redirect')
    router
      .get('/callback/discord', [controllers.auth.Auth, 'handleDiscordCallback'])
      .use(middleware.auth())

    router
      .delete('/unlink/discord', [controllers.auth.Auth, 'unlinkDiscord'])
      .use(middleware.auth())
      .as('discord.unlink')
  })
  .prefix('api/auth')

router
  .group(() => {
    router.get('/settings', [controllers.users.Account, 'edit']).as('settings')
    router.delete('/delete', [controllers.users.Account, 'delete']).as('delete')
  })
  .prefix('/account')
  .use(middleware.auth())
  .as('account')
