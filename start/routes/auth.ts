import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#auth/controllers/auth_controller')
const CharactersController = () => import('#auth/controllers/characters_controller')
const ProfileController = () => import('#auth/controllers/profile_controller')

router
  .group(() => {
    router.get('/redirect/gtaw', [AuthController, 'redirectToProvider']).as('signIn')
    router.get('/callback/gtaw', [AuthController, 'handleCallback'])
    router
      .delete('/delete-user', [AuthController, 'deleteUser'])
      .use(middleware.auth())
      .as('deleteUser')
    router.post('/logout', [AuthController, 'logout']).use(middleware.auth()).as('logout')

    router
      .get('/list-characters', [CharactersController, 'listCharacters'])
      .use(middleware.auth())
      .as('listCharacters')
    router
      .patch('/current-character', [CharactersController, 'switchCharacter'])
      .use(middleware.auth())
      .as('switchCharacter')

    router
      .get('/redirect/discord', [AuthController, 'redirectToDiscord'])
      .use(middleware.auth())
      .as('discord.redirect')
    router
      .get('/callback/discord', [AuthController, 'handleDiscordCallback'])
      .use(middleware.auth())

    router
      .delete('/unlink/discord', [AuthController, 'unlinkDiscord'])
      .use(middleware.auth())
      .as('discord.unlink')
  })
  .prefix('api/auth')

router.get('/profile', [ProfileController, 'show']).use(middleware.auth()).as('profile')
