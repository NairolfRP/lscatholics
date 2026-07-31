import { beforeEach, vi } from 'vitest'
import { mockGetSession, setupAuthenticatedUser } from './utils/test-unit.utils'

vi.mock('@/server/auth', () => ({
  auth: {
    api: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
  },
}))

vi.mock('@tanstack/react-start/server', () => ({
  getRequestHeaders: () => new Headers(),
  setResponseStatus: vi.fn(),
  setCookie: vi.fn(),
  getCookie: vi.fn(),
  deleteCookie: vi.fn(),
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

vi.mock('#server/integrations/logger', () => ({
  logger: {
    child: () => ({
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }),
  },
}))

vi.mock('@tanstack/react-router', () => ({
  notFound: () => {
    throw new Error('NOT_FOUND')
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  setupAuthenticatedUser()
})
