import { DateTime } from "luxon";
import { BaseModel, column, hasOne } from "@adonisjs/lucid/orm";
import User from "#models/user";
import type { HasOne } from "@adonisjs/lucid/types/relations";

export default class Application extends BaseModel {
    @column({ isPrimary: true })
    declare id: number;

    @hasOne(() => User)
    declare user_id: HasOne<typeof User>;

    @column()
    declare character_name: string;

    @column()
    declare application_type: string;

    @column()
    declare status: string;

    @column()
    declare fields: JSON;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;
}
