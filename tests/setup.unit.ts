import { beforeEach, vi } from 'vitest'
import { mockGetSession, setupAuthenticatedUser } from './utils/test-unit.utils'

vi.mock('@/server/auth', () => ({
  auth: {
    api: {
      getSession: (...args: Array<unknown>) => mockGetSession(...args),
    },
  },
}))

vi.mock('@tanstack/react-start/server', () => ({
  getRequestHeaders: () => new Headers(),
}))

vi.mock('@/server/logger', () => ({
  logger: {
    child: () => ({
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }),
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  setupAuthenticatedUser()
})
