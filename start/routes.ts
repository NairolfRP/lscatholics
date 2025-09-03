/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#auth/controllers/auth_controller')
const CharactersController = () => import('#auth/controllers/characters_controller')
const NewsController = () => import('#news/controllers/news_controller')
const ContactController = () => import('#contact/controllers/contact_controller')

router.on('/').renderInertia('home').as('home')
router.get('/newsroom', [NewsController, 'index']).as('news.index')
router.get('/contact', [ContactController, 'index']).as('contact')
router.post('/contact', [ContactController, 'submit']).as('contact.submit')

router
  .get('/newsroom/:slug', [NewsController, 'single'])
  .where('slug', router.matchers.slug())
  .as('news.single')
router
  .group(() => {
    router.get('/redirect/gtaw', [AuthController, 'redirectToProvider'])
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

router.on('/profile').renderInertia('profile').as('profile')
