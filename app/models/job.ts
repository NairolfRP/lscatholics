import { DateTime } from "luxon";
import { BaseModel, column } from "@adonisjs/lucid/orm";

export default class Job extends BaseModel {
    static table = "open_jobs";

    @column({ isPrimary: true })
    declare id: number;

    @column()
    declare title: string;

    @column()
    declare category: number;

    @column()
    declare organization: string;

    @column()
    declare location: string;

    @column()
    declare description: string;

    @column()
    declare requirements: string;

    @column()
    declare wage: string;

    @column.dateTime()
    declare expiration: DateTime;

    @column({
        serialize: (value?: Number) => {
            return Boolean(value);
        },
    })
    declare is_open: boolean;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;
}
