import { DateTime } from "luxon";
import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import User from "#models/user";

export default class UserConnection extends BaseModel {
    @column({ isPrimary: true })
    declare id: number;

    @column()
    declare userID: number;

    @column()
    declare provider: string;

    @column()
    declare providerID: string;

    @column()
    declare username: string;

    @column()
    declare isMain: boolean;

    @belongsTo(() => User, { foreignKey: "userID" })
    declare user: BelongsTo<typeof User>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;
}
