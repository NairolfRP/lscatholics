import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router
  .group(() => {
    router.get('/redirect/gtaw', [controllers.Auth, 'redirectToProvider']).as('signIn')
    router.get('/callback/gtaw', [controllers.Auth, 'handleCallback'])
    router
      .delete('/delete-user', [controllers.Auth, 'deleteUser'])
      .use(middleware.auth())
      .as('deleteUser')
    router.post('/logout', [controllers.Auth, 'logout']).use(middleware.auth()).as('logout')

    router
      .get('/list-characters', [controllers.Characters, 'listCharacters'])
      .use(middleware.auth())
      .as('listCharacters')
    router
      .patch('/current-character', [controllers.Characters, 'switchCharacter'])
      .use(middleware.auth())
      .as('switchCharacter')

    router
      .get('/redirect/discord', [controllers.Auth, 'redirectToDiscord'])
      .use(middleware.auth())
      .as('discord.redirect')
    router
      .get('/callback/discord', [controllers.Auth, 'handleDiscordCallback'])
      .use(middleware.auth())

    router
      .delete('/unlink/discord', [controllers.Auth, 'unlinkDiscord'])
      .use(middleware.auth())
      .as('discord.unlink')
  })
  .prefix('api/auth')

router.get('/profile', [controllers.Profile, 'show']).use(middleware.auth()).as('profile')
