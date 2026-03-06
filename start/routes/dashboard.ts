import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router
  .group(() => {
    router.get('/', [controllers.dashboard.Dashboard, 'index']).as('index')
    router.resource('posts', controllers.posts.DashboardPosts).as('dashboard.posts')
    router
      .resource('events', controllers.scheduledEvents.DashboardScheduledEvents)
      .as('dashboard.events')
    router.resource('jobs', controllers.careers.DashboardJobPostings).as('dashboard.jobs')
    router.resource('users', controllers.users.DashboardUsers).as('dashboard.users')
  })
  .prefix('dashboard')
  .use(middleware.dashboard())
  .as('dashboard')
