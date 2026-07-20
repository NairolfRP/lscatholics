import { vi } from 'vitest'

const hoisted = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
}))

export const mockGetSession = hoisted.mockGetSession
export const mockUser = { id: 'user-1', name: 'Test User' }
export const mockSession = { id: 'session-1' }

export function setupAuthenticatedUser() {
  mockGetSession.mockResolvedValue({
    user: mockUser,
    session: mockSession,
  })
}
