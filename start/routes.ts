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

const HomeController = () => import('#pages/controllers/home_controller')
const AuthController = () => import('#auth/controllers/auth_controller')
const CharactersController = () => import('#auth/controllers/characters_controller')
const NewsController = () => import('#news/controllers/news_controller')
const EventsController = () => import('#events/controllers/events_controller')
const ContactController = () => import('#contact/controllers/contact_controller')
const ParishesController = () => import('#pages/controllers/parishes_controller')
const DepartmentsController = () => import('#pages/controllers/departments_controller')

router.get('/', [HomeController, 'index']).as('home')
router.get('/newsroom', [NewsController, 'index']).as('news.index')
router.get('/contact', [ContactController, 'index']).as('contact')
router.post('/contact', [ContactController, 'submit']).use(middleware.auth()).as('contact.submit')

router
  .get('/event/:slug', [EventsController, 'single'])
  .where('slug', router.matchers.slug())
  .as('event')

router
  .get('/newsroom/:slug', [NewsController, 'single'])
  .where('slug', router.matchers.slug())
  .as('news.single')
router
  .group(() => {
    router.get('/', [EventsController, 'index'])
    router.get('/events', [EventsController, 'index']).as('find.events')
    router.get('/parishes', [ParishesController, 'parishes']).as('find.parishes')
  })
  .prefix('find')

router.on('/about').renderInertia('about_us').as('about-us')
router.on('/archbishop').renderInertia('archbishop').as('archbishop.index')
router.get('/departments', [DepartmentsController, 'index']).as('departments.index')
router
  .get('/department/:slug', [DepartmentsController, 'single'])
  .where('slug', router.matchers.slug())
  .as('departments.single')
router.on('/privacy').renderInertia('privacy').as('privacy')

router.on('daily-readings').renderInertia('readings').as('dailyReadings')

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

router.on('/profile').renderInertia('profile').as('profile')
