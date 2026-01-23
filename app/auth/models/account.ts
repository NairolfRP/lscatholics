import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#auth/models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import encryption from '@adonisjs/core/services/encryption'

export default class Account extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare providerId: string

  @column()
  declare accountId: string

  @column()
  declare accessToken: string | null

  @column()
  declare refreshToken: string | null

  @column.dateTime()
  declare accessTokenExpiresAt: DateTime | null

  @column.dateTime()
  declare refreshTokenExpiresAt: DateTime | null

  @column()
  declare scope: string | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

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
