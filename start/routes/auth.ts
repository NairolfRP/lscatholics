import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router
  .group(() => {
    router.get('/redirect/gtaw', [controllers.auth.Auth, 'redirectToProvider']).as('signIn')
    router.get('/callback/gtaw', [controllers.auth.Auth, 'handleCallback'])
    router
      .delete('/delete-user', [controllers.auth.Auth, 'deleteUser'])
      .use(middleware.auth())
      .as('deleteUser')
    router.post('/logout', [controllers.auth.Auth, 'logout']).use(middleware.auth()).as('logout')

    router
      .get('/list-characters', [controllers.characters.Characters, 'listCharacters'])
      .use(middleware.auth())
      .as('listCharacters')
    router
      .patch('/current-character', [controllers.characters.Characters, 'switchCharacter'])
      .use(middleware.auth())
      .as('switchCharacter')

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

router.get('/profile', [controllers.users.Profile, 'show']).use(middleware.auth()).as('profile')
