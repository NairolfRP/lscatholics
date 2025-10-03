import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#auth/controllers/auth_controller')
const CharactersController = () => import('#auth/controllers/characters_controller')

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
  })
  .prefix('api/auth')

router.on('/profile').renderInertia('profile').use(middleware.auth()).as('profile')
