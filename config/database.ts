import env from "#start/env";
import app from "@adonisjs/core/services/app";
import { defineConfig } from "@adonisjs/lucid";

const migrations = {
    naturalSort: true,
    paths: ["database/migrations"],
};

const prod = defineConfig({
    connection: "postgres",
    connections: {
        postgres: {
            client: "pg",
            connection: {
                host: env.get("DB_HOST"),
                port: env.get("DB_PORT"),
                user: env.get("DB_USER"),
                password: env.get("DB_PASSWORD"),
                database: env.get("DB_DATABASE"),
                ssl: {
                    rejectUnauthorized: true,
                },
            },
            migrations: {
                naturalSort: true,
                paths: ["database/migrations"],
            },
        },
    },
});

const dev = defineConfig({
    connection: "sqlite",
    connections: {
        sqlite: {
            client: "better-sqlite3",
            connection: {
                filename: app.tmpPath("db.sqlite3"),
            },
            useNullAsDefault: true,
            migrations,
        },
    },
});

const dbConfig = env.get("NODE_ENV") === "production" ? prod : dev;

export default dbConfig;
