import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
    protected tableName = "applications";

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments("id");

            table
                .integer("user_id")
                .unsigned()
                .references("id")
                .inTable("users")
                .onDelete("SET NULL")
                .nullable();

            table.string("character_name");
            table.string("application_type");

            table
                .enum("status", ["pending", "in progress", "accepted", "denied"])
                .defaultTo("pending");

            table.json("fields");

            table.timestamp("created_at");
            table.timestamp("updated_at");
        });
    }

    async down() {
        this.schema.dropTable(this.tableName);
    }
}
