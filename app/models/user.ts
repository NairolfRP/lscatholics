import { DateTime } from "luxon";
import { BaseModel, column, hasMany } from "@adonisjs/lucid/orm";
import UserConnection from "#models/user_connection";
import type { HasMany } from "@adonisjs/lucid/types/relations";

export default class User extends BaseModel {
    @column({ isPrimary: true })
    declare id: number;

    @hasMany(() => UserConnection, { foreignKey: "userID" })
    declare connections: HasMany<typeof UserConnection>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null;
}
