import { defineConfig } from "vite";
import { getDirname } from "@adonisjs/core/helpers";
import inertia from "@adonisjs/inertia/client";
import react from "@vitejs/plugin-react-swc";
import adonisjs from "@adonisjs/vite/client";

export default defineConfig({
    plugins: [
        inertia(),
        react(),
        adonisjs({
            entrypoints: ["inertia/app/app.tsx"],
            reload: ["resources/views/**/*.edge"],
        }),
    ],
    build: {
        minify: "esbuild",
    },
    /**
     * Define aliases for importing modules from
     * your frontend code
     */
    resolve: {
        alias: {
            //"~/": `${getDirname(import.meta.url)}/inertia/`,
            "@": `${getDirname(import.meta.url)}/inertia/`,
            "@shared": `${getDirname(import.meta.url)}/shared/`
        },
    },
});
