import { beforeEach, describe, expect, it, vi } from 'vitest'
import { updateCurrentCharacter } from '#server/services/current-character.service'

vi.mock('#server/services/permission.service', () => ({
  resolvePermissions: vi.fn(() => ({ dashboard: ['access'] })),
}))

vi.mock('#server/services/auth.service', () => ({
  revokeAllSessions: vi.fn(() => Promise.resolve()),
  logout: vi.fn(() => Promise.resolve()),
}))

const mockCharacter = {
  id: 1,
  firstname: 'John',
  lastname: 'Doe',
  bankRoutingNumber: '123456789',
  faction: null,
}
const mockSession = { user: { role: 'admin' } }

beforeEach(() => {
  vi.clearAllMocks()
})

describe('updateCurrentCharacter', () => {
  it('switches character and returns new context', async () => {
    const characters = [
      mockCharacter,
      { id: 2, firstname: 'Jane', lastname: 'Doe', bankRoutingNumber: '987654321', faction: null },
    ]

    const result = await updateCurrentCharacter({
      characterId: 1,
      characters,
      session: mockSession,
    })

    expect(result.success).toBe(true)
    expect(result.data.currentCharacter).toEqual(mockCharacter)
    expect(result.data.characters).toHaveLength(2)
    expect(result.data.canAccessDashboard).toBe(true)
  })

  it('revokes sessions and logs out when there are no characters', async () => {
    await expect(
      updateCurrentCharacter({ characterId: 1, characters: [], session: mockSession })
    ).rejects.toThrow('Cannot switch character')
  })

  it('throws when the character is not found in the list', async () => {
    const characters = [mockCharacter]

    await expect(
      updateCurrentCharacter({ characterId: 999, characters, session: mockSession })
    ).rejects.toThrow('Not owner of the character')
  })
})
