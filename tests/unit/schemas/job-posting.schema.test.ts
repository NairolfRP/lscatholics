import { describe, expect, it } from 'vitest'
import { jobPostingsSearchSchema } from '#/features/job-posting/schemas/job-posting.schema.ts'

describe('jobPostingsSearchSchema', () => {
  it('coerces a numeric search term into a string', () => {
    const result = jobPostingsSearchSchema.parse({ page: 1, search: 2026 })

    expect(result.search).toBe('2026')
  })

  it('defaults search to an empty string when absent', () => {
    const result = jobPostingsSearchSchema.parse({ page: 1 })

    expect(result.search).toBe('')
  })
})
