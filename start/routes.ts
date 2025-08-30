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
const NewsController = () => import('#news/controllers/news_controller')
const ContactController = () => import('#contact/controllers/contact_controller')

router.on('/').renderInertia('home').as('home')
router.get('/newsroom', [NewsController, 'index']).as('news.index')
router.get('/contact', [ContactController, 'index']).as('contact')
router.post('/contact', [ContactController, 'submit']).as('contact.submit')

router
  .get('/newsroom/:id', [NewsController, 'single'])
  .where('id', router.matchers.slug())
  .get('/newsroom/:slug', [NewsController, 'single'])
  .where('slug', router.matchers.slug())
  .as('news.single')
router
  .group(() => {
    router.get('/redirect/gtaw', [AuthController, 'redirectToProvider'])
    router.get('/callback/gtaw', [AuthController, 'handleCallback'])
    router.get('/logout', [AuthController, 'logout']).use(middleware.auth()).as('logout')
  })
  .prefix('api/auth')
