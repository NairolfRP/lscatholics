import { users } from '#server/db/schema'
import { BaseRepository } from './base.repository'

type UserSchemaKeys = keyof typeof users.$inferSelect

export type UsersColumns = {
  [K in UserSchemaKeys]?: boolean
}

class UserRepository extends BaseRepository<typeof users> {
  constructor() {
    super(undefined, users)
  }
}

export const userRepository = new UserRepository()
