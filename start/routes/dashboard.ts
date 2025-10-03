import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const DashboardController = () => import('#dashboard/controllers/pages_controller')
const DashboardArticlesController = () => import('#dashboard/controllers/articles_controller')
const DashboardEventsController = () => import('#dashboard/controllers/events_controller')

router
  .group(() => {
    router.get('/', [DashboardController, 'index']).as('index')
    router.resource('articles', DashboardArticlesController).as('dashboard.articles')
    router.resource('events', DashboardEventsController).as('dashboard.events')
  })
  .prefix('dashboard')
  .use(middleware.auth())
  .use(middleware.dashboard())
  .as('dashboard')
