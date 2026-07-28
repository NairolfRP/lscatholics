import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'
import { z } from 'zod'
import {
  baseJobPostingInteractionSchema,
  createJobPostingSchema,
  editJobPostingSchema,
} from '#/features/job-posting/schemas/job-posting.schema.ts'
import { requirePermission } from '#/middleware/permission.middleware.ts'
import { getFieldErrors } from '#/utils/form.ts'
import { resolveSlug } from '#/utils/slug.ts'
import { NotFoundException } from '#server/exceptions/http-exception.ts'
import { logger } from '#server/integrations/logger.ts'
import { jobPostingRepository } from '#server/repositories/job-posting.repository.ts'
import { DASHBOARD_PAGINATION_LIMIT } from '#shared/constants/dashboard.ts'
import { looseObjectSchema } from '#shared/schemas/common.schema.ts'
import { dashboardSearchSchema } from '#shared/schemas/dashboard/search.schema.ts'

export const getDashboardJobPostingFn = createServerFn({ method: 'GET' })
  .middleware([requirePermission('job', 'read')])
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const jobPosting = await jobPostingRepository.getJobPostingWithAuthor({
      id: data,
      authorColumns: {
        id: true,
        name: true,
      },
      includeInactive: true,
      includeExpired: true,
    })

    if (!jobPosting) {
      throw notFound()
    }

    return jobPosting
  })

export const getDashboardJobPostingsFn = createServerFn({ method: 'GET' })
  .middleware([requirePermission('job', 'read')])
  .validator(dashboardSearchSchema)
  .handler(async ({ data }) => {
    return jobPostingRepository.getJobPostings({
      columns: {
        id: true,
        slug: true,
        title: true,
        department: true,
        employmentType: true,
        isActive: true,
        expiresAt: true,
        postedAt: true,
        createdAt: true,
      },
      page: data.page,
      pageSize: DASHBOARD_PAGINATION_LIMIT,
      orderBy: [data.sortBy],
      includeExpired: true,
      includeInactives: true,
      searchText: data.search
        ? [
            { column: 'title', text: `%${data.search}%` },
            { column: 'description', text: `%${data.search}%` },
          ]
        : undefined,
    })
  })

export const jobPostingDeleteFn = createServerFn({ method: 'POST' })
  .middleware([requirePermission('job', 'delete')])
  .validator(baseJobPostingInteractionSchema)
  .handler(async ({ data, context }) => {
    const jobPosting = await jobPostingRepository.getJobPosting({
      id: data.jobPostingId,
      includeExpired: true,
      includeInactive: true,
      columns: { id: true },
    })

    if (!jobPosting) {
      setResponseStatus(404)
      throw NotFoundException('Job Posting not found')
    }

    try {
      await jobPostingRepository.deleteJobPosting({ id: jobPosting.id })
      return { success: true }
    } catch (err) {
      logger.error(
        {
          err,
          user: {
            id: context.session.user.id,
            name: context.session.user.name,
            roles: JSON.stringify(context.session.user.role.split(',')),
          },
        },
        "Failed to delete job posting (id: '%s')",
        jobPosting.id
      )

      setResponseStatus(500)
      throw new Error('Internal error')
    }
  })

export const toggleJobPostingActiveStateFn = createServerFn({ method: 'POST' })
  .middleware([requirePermission('job', 'update')])
  .validator(baseJobPostingInteractionSchema)
  .handler(async ({ data, context }) => {
    const jobPosting = await jobPostingRepository.getJobPosting({
      id: data.jobPostingId,
      includeExpired: true,
      includeInactive: true,
      columns: { id: true, isActive: true },
    })

    if (!jobPosting) {
      setResponseStatus(404)
      throw NotFoundException('Job Posting not found')
    }

    try {
      const state = !jobPosting.isActive
      const result = await jobPostingRepository.update(
        { id: jobPosting.id },
        { isActive: state, postedAt: state ? new Date() : null }
      )
      return { success: true, state: Boolean(result[0].isActive) }
    } catch (err) {
      logger.error(
        {
          err,
          user: {
            id: context.session.user.id,
            name: context.session.user.name,
            roles: JSON.stringify(context.session.user.role.split(',')),
          },
        },
        "Failed to toggle the job posting active state (id: '%s')",
        jobPosting.id
      )

      setResponseStatus(500)
      throw new Error('Internal error')
    }
  })

export const createJobPostingFn = createServerFn({ method: 'POST' })
  .middleware([requirePermission('job', 'create')])
  .validator(looseObjectSchema)
  .handler(async ({ data, context }) => {
    try {
      const validatedData = await createJobPostingSchema.parseAsync(data)

      let slug = resolveSlug(validatedData.slug, validatedData.title)

      if (await jobPostingRepository.existsBySlug(slug)) {
        let counter = 1
        const baseSlug = slug
        while (await jobPostingRepository.existsBySlug(slug)) {
          slug = `${baseSlug}-${counter}`
          counter++
        }
      }

      const postedAt = validatedData.isActive ? validatedData.postedAt : null
      const expiresAt = validatedData.isActive ? validatedData.expiresAt : null

      const createdJobPosting = await jobPostingRepository.create(
        {
          title: validatedData.title,
          slug,
          description: validatedData.description,
          reportsTo: validatedData.reportsTo,
          department: validatedData.department,
          responsibilities: validatedData.responsibilities,
          requirements: validatedData.requirements,
          skills: validatedData.skills,
          salaryMin: validatedData.salary.min,
          salaryMax: validatedData.salary.max,
          employmentType: validatedData.employmentType,
          isActive: validatedData.isActive,
          postedAt,
          expiresAt,
          authorId: context.session.user.id,
        },
        { returning: ['id'] }
      )

      return { success: true, jobPostingId: createdJobPosting[0].id }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors = getFieldErrors(err)
        setResponseStatus(400)
        return { success: false, validationErrors }
      }

      logger.error({ err, data, userId: context.session.user.id }, 'Failed to create job posting')
      setResponseStatus(500)
      return { success: false, error: 'Une erreur est survenue' }
    }
  })

export const updateJobPostingFn = createServerFn({ method: 'POST' })
  .middleware([requirePermission('job', 'update')])
  .validator(async (data: unknown) => {
    const schema = z
      .object({
        jobPostingId: z.uuidv4({
          error: (iss) => (iss.input === undefined ? 'Missing church event ID' : 'Bad ID format'),
        }),
      })
      .catchall(z.unknown())
      .refine((obj) => Object.keys(obj).length > 1, {
        error: 'Invalid body',
      })

    const { jobPostingId, ...values } = await schema.parseAsync(data)

    const jobPosting = await jobPostingRepository.getJobPosting({
      id: jobPostingId,
      includeExpired: true,
      includeInactive: true,
      columns: { slug: true },
    })

    if (!jobPosting) {
      throw NotFoundException('Job Posting not found')
    }

    return { jobPostingId, jobPosting, values }
  })
  .handler(async ({ data: rawData, context }) => {
    const { jobPostingId, jobPosting, values } = rawData

    try {
      const validatedData = await editJobPostingSchema.parseAsync(values)

      let slug = resolveSlug(validatedData.slug, validatedData.title)
      if (slug !== jobPosting.slug && (await jobPostingRepository.existsBySlug(slug))) {
        let counter = 1
        const baseSlug = slug
        while (await jobPostingRepository.existsBySlug(slug)) {
          slug = `${baseSlug}-${counter}`
          counter++
        }
      }

      const postedAt = validatedData.isActive ? validatedData.postedAt : null
      const expiresAt = validatedData.isActive ? validatedData.expiresAt : null

      await jobPostingRepository.update(
        {
          id: jobPostingId,
        },
        {
          ...validatedData,
          salaryMin: validatedData.salary.min,
          salaryMax: validatedData.salary.max,
          slug,
          postedAt,
          expiresAt,
        }
      )

      return { success: true }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors = getFieldErrors(err)
        setResponseStatus(400)
        return { success: false, error: null, validationErrors }
      }

      logger.error(
        { err, jobPostingId, userId: context.session.user.id },
        'Failed to update job posting'
      )

      setResponseStatus(500)
      return { success: false, error: 'Une erreur est survenue' }
    }
  })
