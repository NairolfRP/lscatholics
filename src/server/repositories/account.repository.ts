import { accounts } from '#server/db/schema'
import { BaseRepository } from './base.repository'

type AccountsColumns = {
  [K in keyof typeof accounts.$inferSelect]?: boolean
}

class AccountRepository extends BaseRepository<typeof accounts> {
  constructor() {
    super(undefined, accounts)
  }

  async getDiscordAccount<TColumns extends AccountsColumns>({
    columns,
    userId,
  }: {
    columns?: TColumns
    userId: string
  }) {
    return this.db.query.accounts.findFirst({
      columns: { ...columns, id: true },
      where: (schema, { and, eq }) =>
        and(eq(schema.providerId, 'discord'), eq(schema.userId, userId)),
    })
  }
}

export const accountRepository = new AccountRepository()
