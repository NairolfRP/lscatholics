import { vi } from 'vitest'
import type { User } from '#shared/lib/types/auth.ts'

const hoisted = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
}))

export const mockGetSession = hoisted.mockGetSession
export const mockUser: User = {
  id: 'user-1',
  name: 'Test User',
  email: 'user-1@fake.email.placeholder',
  emailVerified: false,
  role: 'user',
  banned: false,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
}
export const mockSession = { id: 'session-1' }

export function setupAuthenticatedUser() {
  mockGetSession.mockResolvedValue({
    user: mockUser,
    session: mockSession,
  })
}
