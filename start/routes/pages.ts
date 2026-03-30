import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router.get('/', [controllers.pages.Home, 'index']).as('home')

router.get('/contact', [controllers.pages.Contact, 'index']).as('contact')
router
  .post('/contact', [controllers.pages.Contact, 'submit'])
  .use(middleware.auth())
  .as('contact.submit')

router.get('/newsroom', [controllers.posts.Posts, 'index']).as('news.index')
router
  .get('/newsroom/:slug', [controllers.posts.Posts, 'single'])
  .where('slug', router.matchers.slug())
  .as('news.single')

router.get('/find', [controllers.scheduledEvents.ScheduledEvents, 'index'])
router.get('/find/events', [controllers.scheduledEvents.ScheduledEvents, 'index']).as('find.events')
router
  .get('/event/:slug', [controllers.scheduledEvents.ScheduledEvents, 'single'])
  .where('slug', router.matchers.slug())
  .as('event')

router.get('/find/parishes', [controllers.pages.Parishes, 'parishes']).as('find.parishes')

router.on('/about').renderInertia('about-us', {}).as('about-us')

router.on('/archbishop').renderInertia('archbishop', {}).as('archbishop.index')

router.get('/departments', [controllers.pages.Departments, 'index']).as('departments.index')
router
  .get('/department/:slug', [controllers.pages.Departments, 'single'])
  .where('slug', router.matchers.slug())
  .as('departments.single')

router.get('/services', [controllers.pages.Services, 'index']).as('services.index')
router.get('/services/:slug', [controllers.pages.Services, 'single']).as('services.single')

router.get('/donate', [controllers.donate.Donate, 'index']).as('donate.index')
router.post('/donate', [controllers.donate.Donate, 'submit']).as('donate.submit')

router
  .get('/register-parishioner', [controllers.pages.RegisterParishioners, 'index'])
  .as('registerParishioner.index')
router
  .post('/register-parishioner', [controllers.pages.RegisterParishioners, 'submit'])
  .as('registerParishioner.submit')
  .use(middleware.auth())

router.on('/privacy').renderInertia('privacy', {}).as('privacy')

router
  .group(() => {
    router.get('/', [controllers.pages.Charities, 'index']).as('charities.index')
    router
      .get('/program/:slug', [controllers.pages.Charities, 'showProgram'])
      .where('slug', router.matchers.slug())
      .as('charities.program')
  })
  .prefix('/catholic-charities')

router.on('/vocations').renderInertia('vocations', {}).as('vocations')

router.get('/jobs', [controllers.careers.JobPostings, 'index']).as('jobs.index')
router
  .get('/jobs/:slug', [controllers.careers.JobPostings, 'single'])
  .where('slug', router.matchers.slug())
  .as('jobs.single')

router
  .group(() => {
    router.get('/', [controllers.careers.JobApplications, 'index']).as('jobs.application')
    router.post('/', [controllers.careers.JobApplications, 'submit']).as('jobs.application_submit')
  })
  .prefix('/employment-application/:slug')
  .where('slug', router.matchers.slug())
  .use(middleware.auth())

router.on('daily-readings').renderInertia('readings', {}).as('dailyReadings')

router
  .group(() => {
    router.get('/', [controllers.pages.Decrees, 'index']).as('decrees.index')
    router
      .get('/:uid', [controllers.pages.Decrees, 'single'])
      .where('uid', {
        match: /^[\w\d_-]+$/,
        cast(slug) {
          const tokens = slug.split('-')
          const threadId = tokens.shift()
          return { threadId, slug: tokens.join('-') }
        },
      })
      .as('decrees.single')
  })
  .prefix('decrees')
