import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router
  .group(() => {
    router.get('/', [controllers.DashboardPages, 'index']).as('index')
    router.resource('articles', controllers.DashboardArticles).as('dashboard.articles')
    router.resource('events', controllers.DashboardEvents).as('dashboard.events')
    router.resource('jobs', controllers.DashboardJobs).as('dashboard.jobs')
  })
  .prefix('dashboard')
  .use(middleware.auth())
  .use(middleware.dashboard())
  .as('dashboard')
