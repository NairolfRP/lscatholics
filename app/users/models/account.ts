import { beforeSave, belongsTo } from '@adonisjs/lucid/orm'
import User from '#users/models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import encryption from '@adonisjs/core/services/encryption'
import { AccountSchema } from '#database/schema'

export default class Account extends AccountSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @beforeSave()
  public static async encryptTokens(account: Account) {
    if (account.$dirty.accessToken && account.accessToken) {
      account.accessToken = encryption.encrypt(account.accessToken)
    }
    if (account.$dirty.refreshToken && account.refreshToken) {
      account.refreshToken = encryption.encrypt(account.refreshToken)
    }
  }

  public getDecryptedAccessToken(): string | null {
    if (!this.accessToken) {
      return null
    }
    return encryption.decrypt(this.accessToken)
  }

  public getDecryptedRefreshToken(): string | null {
    if (!this.refreshToken) {
      return null
    }
    return encryption.decrypt(this.refreshToken)
  }
}
