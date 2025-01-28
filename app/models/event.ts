import { DateTime } from "luxon";
import { BaseModel, column } from "@adonisjs/lucid/orm";
import { Str } from "../../shared/helpers/str.js";

export default class Event extends BaseModel {
    static table = "events";

    @column({ isPrimary: true })
    declare id: number;

    @column()
    declare title: string;

    @column()
    declare description: string;

    @column()
    declare image: string;

    @column.dateTime()
    declare datetime: DateTime;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public mapSummaryToDisplay() {
        const { id, title, description, image, datetime } = this;

        return {
            id,
            title,
            description: Str.limit(description),
            image,
            datetime: datetime.toFormat("MMMM d, yyyy, h:mm a"),
            link: `/event/${datetime.year}/${datetime.month}/${id}/${Str.slug(title)}`,
        };
    }
}
