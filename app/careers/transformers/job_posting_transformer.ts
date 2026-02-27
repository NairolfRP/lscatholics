import { BaseTransformer } from '@adonisjs/core/transformers'
import type JobPosting from '#careers/models/job_posting'

export default class JobPostingTransformer extends BaseTransformer<JobPosting> {
  toObject() {
    return this.pick(this.resource, ['id', 'title', 'isActive', 'postedAt'])
  }

  allFields() {
    return this.pick(this.resource, [
      'id',
      'slug',
      'title',
      'summary',
      'reportsTo',
      'department',
      'responsibilities',
      'requirements',
      'salary',
      'employmentType',
      'isActive',
      'postedAt',
      'expiresAt',
      'createdAt',
      'updatedAt',
    ])
  }

  publicSummaryDetails() {
    return this.pick(this.resource, ['id', 'slug', 'title', 'department', 'postedAt'])
  }

  employmentApplication() {
    return this.pick(this.resource, ['id', 'slug', 'title'])
  }
}
