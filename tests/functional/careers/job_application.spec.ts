import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import JobPosting from '#careers/models/job_posting'
import User from '#users/models/user'
import { UserFactory } from '#database/factories/user_factory'
import { JobFactory } from '#database/factories/job_factory'

test.group('JobApplications - index', (group) => {
  group.each.teardown(async () => {
    await JobPosting.query().delete()
    await User.query().delete()
  })

  test('displays the application form for an active job', async ({ client }) => {
    const user = await UserFactory.create()
    const job = await JobFactory.merge({ isActive: true, expiresAt: null }).create()

    const response = await client
      .get(`/employment-application/${job.slug}`)
      .loginAs(user)
      .withInertia()

    response.assertStatus(200)
    response.assertInertiaComponent('jobs/application')
    response.assertInertiaPropsContains({ isExpired: false })
  })

  test('isExpired is false for a job expiring in the future', async ({ client }) => {
    const user = await UserFactory.create()
    const job = await JobFactory.merge({
      isActive: true,
      expiresAt: DateTime.now().plus({ days: 7 }),
    }).create()

    const response = await client
      .get(`/employment-application/${job.slug}`)
      .loginAs(user)
      .withInertia()

    response.assertInertiaPropsContains({ isExpired: false })
  })

  test('returns 404 for an expired job', async ({ client }) => {
    const user = await UserFactory.create()
    const job = await JobFactory.merge({
      isActive: true,
      expiresAt: DateTime.now().minus({ days: 1 }),
    }).create()

    const response = await client
      .get(`/employment-application/${job.slug}`)
      .loginAs(user)
      .withInertia()

    response.assertStatus(404)
  })
})

test.group('JobPostings - index', (group) => {
  group.each.teardown(async () => {
    await JobPosting.query().delete()
  })

  test('returns only active job postings', async ({ assert, client }) => {
    await JobFactory.merge({ isActive: true }).createMany(2)
    await JobFactory.merge({ isActive: false }).create()

    const response = await client.get('/jobs').withInertia()

    response.assertStatus(200)
    const { offers } = response.inertiaProps
    assert.equal(offers.data.length, 2)
  })

  test('redirects to page 1 when page is out of range', async ({ client }) => {
    await JobFactory.merge({ isActive: true }).create()

    const response = await client.get('/jobs?page=999')
    response.assertRedirectsTo('/jobs')
  })
})
