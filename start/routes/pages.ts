import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const HomeController = () => import('#pages/controllers/home_controller')
const ContactController = () => import('#contact/controllers/contact_controller')
const NewsController = () => import('#news/controllers/news_controller')
const EventsController = () => import('#events/controllers/events_controller')
const ParishesController = () => import('#pages/controllers/parishes_controller')
const DepartmentsController = () => import('#pages/controllers/departments_controller')
const ServicesController = () => import('#pages/controllers/services_controller')
const DonateController = () => import('#pages/controllers/donate_controller')
const RegisterParishionerController = () =>
  import('#pages/controllers/register_parishioners_controller')
const JobsController = () => import('#pages/controllers/jobs_controller')
const JobApplicationsController = () => import('#pages/controllers/job_applications_controller')

router.get('/', [HomeController, 'index']).as('home')

router.get('/contact', [ContactController, 'index']).as('contact')
router.post('/contact', [ContactController, 'submit']).use(middleware.auth()).as('contact.submit')

router.get('/newsroom', [NewsController, 'index']).as('news.index')
router
  .get('/newsroom/:slug', [NewsController, 'single'])
  .where('slug', router.matchers.slug())
  .as('news.single')

router.get('/find', [EventsController, 'index'])
router.get('/find/events', [EventsController, 'index']).as('find.events')
router
  .get('/event/:slug', [EventsController, 'single'])
  .where('slug', router.matchers.slug())
  .as('event')

router.get('/find/parishes', [ParishesController, 'parishes']).as('find.parishes')

router.on('/about').renderInertia('about_us').as('about-us')

router.on('/archbishop').renderInertia('archbishop').as('archbishop.index')

router.get('/departments', [DepartmentsController, 'index']).as('departments.index')
router
  .get('/department/:slug', [DepartmentsController, 'single'])
  .where('slug', router.matchers.slug())
  .as('departments.single')

router.get('/services', [ServicesController, 'index']).as('services.index')
router.get('/services/:slug', [ServicesController, 'single']).as('services.single')

router.get('/donate', [DonateController, 'index']).as('donate.index')
router.post('/donate', [DonateController, 'submit']).as('donate.submit')

router
  .get('/register-parishioner', [RegisterParishionerController, 'index'])
  .as('registerParishioner.index')
router
  .post('/register-parishioner', [RegisterParishionerController, 'submit'])
  .as('registerParishioner.submit')
  .use(middleware.auth())

router.on('/privacy').renderInertia('privacy').as('privacy')

router.on('/catholic-charities').renderInertia('catholic-charities').as('charities.index')

router.on('/vocations').renderInertia('vocations').as('vocations')

router.get('/jobs', [JobsController, 'index']).as('jobs.index')
router
  .get('/jobs/:slug', [JobsController, 'single'])
  .where('slug', router.matchers.slug())
  .as('jobs.single')

router
  .group(() => {
    router.get('/', [JobApplicationsController, 'index']).as('jobs.application')
    router.post('/', [JobApplicationsController, 'submit']).as('jobs.application_submit')
  })
  .prefix('/employment-application/:slug')
  .where('slug', router.matchers.slug())
  .use(middleware.auth())

router.on('daily-readings').renderInertia('readings').as('dailyReadings')
