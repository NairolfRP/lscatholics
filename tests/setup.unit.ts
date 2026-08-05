import { afterEach, beforeAll, beforeEach, vi } from 'vitest'
import { resetDb, setupTestDb } from './utils/test-db'
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
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    child: () => ({
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
      child: vi.fn(),
    }),
  },
}))

vi.mock('@tanstack/react-router', () => ({
  notFound: () => {
    throw new Error('NOT_FOUND')
  },
}))

beforeAll(setupTestDb)

afterEach(resetDb)

beforeEach(() => {
  vi.clearAllMocks()
  setupAuthenticatedUser()
})
