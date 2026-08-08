import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getAllUserCharactersWithFactions } from '#server/services/character.service'
import {
  getCurrentCharacter,
  updateCurrentCharacter,
} from '#server/services/current-character.service'

vi.mock('#server/services/permission.service', () => ({
  resolvePermissions: vi.fn(() => ({ dashboard: ['access'] })),
}))

vi.mock('#server/services/auth.service', () => ({
  revokeAllSessions: vi.fn(() => Promise.resolve()),
  logout: vi.fn(() => Promise.resolve()),
}))

vi.mock('#server/services/character.service', () => ({
  getAllUserCharacters: vi.fn(),
  getAllUserCharactersWithFactions: vi.fn(),
}))

const getCookieMock = vi.fn()
vi.mock('@tanstack/react-start/server', () => ({
  getCookie: (...args: unknown[]) => getCookieMock(...args),
  deleteCookie: vi.fn(),
  setCookie: vi.fn(),
  setResponseStatus: vi.fn(),
}))

const mockCharacter = {
  id: 1,
  firstname: 'John',
  lastname: 'Doe',
  bankRoutingNumber: '123456789',
  faction: null,
}
const mockSession = { user: { role: 'admin' } }

const mockedGetAllUserCharactersWithFactions = vi.mocked(getAllUserCharactersWithFactions)

beforeEach(() => {
  vi.clearAllMocks()
  getCookieMock.mockReturnValue(undefined)
})

describe('getCurrentCharacter', () => {
  it('returns the first character and all characters when no cookie is set', async () => {
    mockedGetAllUserCharactersWithFactions.mockResolvedValue([mockCharacter])

    const result = await getCurrentCharacter({
      withFaction: true,
      withAllCharacters: true,
    })

    expect(result).toEqual({ currentCharacter: mockCharacter, characters: [mockCharacter] })
  })

  it('returns the character from the cookie when one is set', async () => {
    const secondCharacter = {
      id: 2,
      firstname: 'Jane',
      lastname: 'Doe',
      bankRoutingNumber: '987654321',
      faction: null,
    }
    getCookieMock.mockReturnValue('2')
    mockedGetAllUserCharactersWithFactions.mockResolvedValue([mockCharacter, secondCharacter])

    const result = await getCurrentCharacter({
      withFaction: true,
      withAllCharacters: true,
    })

    expect(result).toEqual({
      currentCharacter: secondCharacter,
      characters: [mockCharacter, secondCharacter],
    })
  })

  it('returns a single character when withAllCharacters is false', async () => {
    mockedGetAllUserCharactersWithFactions.mockResolvedValue([mockCharacter])

    const result = await getCurrentCharacter({ withFaction: true })

    expect(result).toEqual(mockCharacter)
  })
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
