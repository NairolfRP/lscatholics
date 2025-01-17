import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
    protected tableName = "open_jobs";

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments("id");

            table.text("title", "longtext");
            table.integer("category");
            table.text("organization", "longtext").nullable();
            table.text("location").nullable();
            table.text("description", "longtext");
            table.text("requirements", "longtext");
            table.text("wage", "text").nullable();
            table.dateTime("expiration").nullable();
            table.boolean("is_open").defaultTo(false);

            table.timestamp("created_at");
            table.timestamp("updated_at");
        });
    }

    async down() {
        this.schema.dropTable(this.tableName);
    }
}
