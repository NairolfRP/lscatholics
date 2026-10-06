import { beforeEach, describe, expect, it, vi } from 'vitest'
import { jobPostingRepository } from '#server/repositories/job-posting.repository'
import * as jobPostingService from '#server/services/job-posting.service'
import { DEPARTMENT } from '#shared/constants/department.ts'
import type { User } from '#shared/lib/types/auth.ts'

vi.mock('#server/repositories/job-posting.repository', () => ({
  jobPostingRepository: {
    getJobPostingWithAuthor: vi.fn(),
    getJobPostings: vi.fn(),
    getJobPosting: vi.fn(),
    deleteJobPosting: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    existsBySlug: vi.fn(),
  },
}))

const mockUser: User = {
  id: 'user-1',
  name: 'Test User',
  email: 'user-1@fake-email.placeholder',
  emailVerified: false,
  role: 'admin',
  banned: false,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getDashboardJobPosting', () => {
  it('returns a job posting when it exists', async () => {
    const mockPosting = {
      id: 'job-1',
      title: 'Software Engineer',
      department: DEPARTMENT.GENERAL_SERVICES,
    }
    vi.mocked(jobPostingRepository.getJobPostingWithAuthor).mockResolvedValue(
      mockPosting as unknown as Awaited<
        ReturnType<typeof jobPostingRepository.getJobPostingWithAuthor>
      >
    )

    const result = await jobPostingService.getDashboardJobPosting({ id: 'job-1' })

    expect(result).toEqual(mockPosting)
  })

  it('throws notFound when the posting does not exist', async () => {
    vi.mocked(jobPostingRepository.getJobPostingWithAuthor).mockResolvedValue(
      null as unknown as Awaited<ReturnType<typeof jobPostingRepository.getJobPostingWithAuthor>>
    )

    await expect(jobPostingService.getDashboardJobPosting({ id: 'missing' })).rejects.toThrow(
      'NOT_FOUND'
    )
  })
})

describe('toggleJobPostingActiveState', () => {
  it('toggles from inactive to active', async () => {
    vi.mocked(jobPostingRepository.getJobPosting).mockResolvedValue({
      id: 'job-1',
      isActive: false,
    } as unknown as Awaited<ReturnType<typeof jobPostingRepository.getJobPosting>>)
    vi.mocked(jobPostingRepository.update).mockResolvedValue([
      { id: 'job-1', isActive: true },
    ] as unknown as Awaited<ReturnType<typeof jobPostingRepository.update>>)

    const result = await jobPostingService.toggleJobPostingActiveState({
      jobPostingId: 'job-1',
      user: mockUser,
    })

    expect(result).toEqual({ success: true, state: true })
    expect(jobPostingRepository.update).toHaveBeenCalledWith(
      { id: 'job-1' },
      expect.objectContaining({ isActive: true })
    )
  })

  it('throws when the posting does not exist', async () => {
    vi.mocked(jobPostingRepository.getJobPosting).mockResolvedValue(
      null as unknown as Awaited<ReturnType<typeof jobPostingRepository.getJobPosting>>
    )

    await expect(
      jobPostingService.toggleJobPostingActiveState({ jobPostingId: 'missing', user: mockUser })
    ).rejects.toThrow('Job Posting not found')
  })
})

describe('getJobPostings', () => {
  it('escapes LIKE wildcards in the search text', async () => {
    vi.mocked(jobPostingRepository.getJobPostings).mockResolvedValue({
      jobPostings: [],
      total: 0,
    })

    await jobPostingService.getJobPostings({ page: 1, search: '50%_\\' })

    const searchText = vi.mocked(jobPostingRepository.getJobPostings).mock.calls[0][0]!.searchText
    expect(searchText).toEqual([
      { column: 'title', text: '%50\\%\\_\\\\%' },
      { column: 'description', text: '%50\\%\\_\\\\%' },
      { column: 'responsibilities', text: '%50\\%\\_\\\\%' },
    ])
  })
})

describe('createJobPosting', () => {
  it('creates a job posting and returns its id', async () => {
    const validData = {
      title: 'Developer',
      description: 'Build things',
      department: 'communications',
      responsibilities: ['Write code'],
      employmentType: 'full_time',
      reportsTo: null,
      salary: { min: 50000, max: null },
      postedAt: null,
      expiresAt: null,
      isActive: true,
    }
    vi.mocked(jobPostingRepository.existsBySlug).mockResolvedValue(false)
    vi.mocked(jobPostingRepository.create).mockResolvedValue([
      { id: 'new-job-1' },
    ] as unknown as Awaited<ReturnType<typeof jobPostingRepository.create>>)

    const result = await jobPostingService.createJobPosting({ data: validData, user: mockUser })

    expect(result).toEqual({ success: true, jobPostingId: 'new-job-1' })
  })
})
