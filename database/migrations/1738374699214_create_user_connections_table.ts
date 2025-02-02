import User from "#models/user";
import { BaseSchema } from "@adonisjs/lucid/schema";
import UserConnection from "#models/user_connection";

export default class extends BaseSchema {
    protected tableName = "user_connections";

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments("id");

            table
                .integer("user_id")
                .unsigned()
                .references("id")
                .inTable("users")
                .onDelete("CASCADE");
            table.string("provider").notNullable();
            table.string("provider_id").notNullable();
            table.string("username").notNullable();
            table.boolean("is_main").defaultTo(false);

            table.timestamp("created_at");
            table.timestamp("updated_at");

            table.unique(["user_id", "provider"]);
            table.unique(["provider", "provider_id"]);
        });

        const users = (await User.all()) as unknown as (User & { name: string })[];

        for (const user of users) {
            if ("facebrowser_id" in user && user.facebrowser_id) {
                await UserConnection.create({
                    userID: user.id,
                    provider: "facebrowser",
                    providerID: user.facebrowser_id as string,
                    username: user.name || "Unknown",
                    isMain: true,
                });
            }

            if ("discord_id" in user) {
                await UserConnection.create({
                    userID: user.id,
                    provider: "discord",
                    providerID: user.discord_id as string,
                    username: user.name || "Unknown",
                    isMain:
                        !("facebrowser_id" in user) ||
                        ("facebrowser_id" in user && !user.facebrowser_id),
                });
            }
        }

        this.schema.alterTable("users", (table) => {
            table.dropColumn("name");
            table.dropColumn("facebrowser_id");
            table.dropColumn("discord_id");
        });
    }

    async down() {
        this.schema.dropTable(this.tableName);
    }
}
