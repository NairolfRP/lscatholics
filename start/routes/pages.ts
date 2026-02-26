import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router.get('/', [controllers.Home, 'index']).as('home')

router.get('/contact', [controllers.Contact, 'index']).as('contact')
router.post('/contact', [controllers.Contact, 'submit']).use(middleware.auth()).as('contact.submit')

router.get('/newsroom', [controllers.News, 'index']).as('news.index')
router
  .get('/newsroom/:slug', [controllers.News, 'single'])
  .where('slug', router.matchers.slug())
  .as('news.single')

router.get('/find', [controllers.Events, 'index'])
router.get('/find/events', [controllers.Events, 'index']).as('find.events')
router
  .get('/event/:slug', [controllers.Events, 'single'])
  .where('slug', router.matchers.slug())
  .as('event')

router.get('/find/parishes', [controllers.Parishes, 'parishes']).as('find.parishes')

router.on('/about').renderInertia('about_us', {}).as('about-us')

router.on('/archbishop').renderInertia('archbishop', {}).as('archbishop.index')

router.get('/departments', [controllers.Departments, 'index']).as('departments.index')
router
  .get('/department/:slug', [controllers.Departments, 'single'])
  .where('slug', router.matchers.slug())
  .as('departments.single')

router.get('/services', [controllers.Services, 'index']).as('services.index')
router.get('/services/:slug', [controllers.Services, 'single']).as('services.single')

router.get('/donate', [controllers.Donate, 'index']).as('donate.index')
router.post('/donate', [controllers.Donate, 'submit']).as('donate.submit')

router
  .get('/register-parishioner', [controllers.RegisterParishioners, 'index'])
  .as('registerParishioner.index')
router
  .post('/register-parishioner', [controllers.RegisterParishioners, 'submit'])
  .as('registerParishioner.submit')
  .use(middleware.auth())

router.on('/privacy').renderInertia('privacy', {}).as('privacy')

router.on('/catholic-charities').renderInertia('catholic-charities', {}).as('charities.index')

router.on('/vocations').renderInertia('vocations', {}).as('vocations')

router.get('/jobs', [controllers.Jobs, 'index']).as('jobs.index')
router
  .get('/jobs/:slug', [controllers.Jobs, 'single'])
  .where('slug', router.matchers.slug())
  .as('jobs.single')

router
  .group(() => {
    router.get('/', [controllers.JobApplications, 'index']).as('jobs.application')
    router.post('/', [controllers.JobApplications, 'submit']).as('jobs.application_submit')
  })
  .prefix('/employment-application/:slug')
  .where('slug', router.matchers.slug())
  .use(middleware.auth())

router.on('daily-readings').renderInertia('readings', {}).as('dailyReadings')
