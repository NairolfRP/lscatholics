import { DateTime } from "luxon";
import { BaseModel, column } from "@adonisjs/lucid/orm";

export default class User extends BaseModel {
    @column({ isPrimary: true })
    declare id: number;

    @column()
    declare name: string | null;

    @column()
    declare facebrowser_id: string;

    @column()
    declare discord_id: string;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null;
}
