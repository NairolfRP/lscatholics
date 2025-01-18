import { Request } from "@adonisjs/core/http";
import { z } from "zod";

declare module "@adonisjs/core/http" {
    interface Request {
        validate<T extends z.ZodTypeAny>(schema: T): Promise<z.infer<T>>;
    }
}

Request.macro("validate", async function <
    T extends z.ZodTypeAny,
>(this: Request, schema: T): Promise<z.infer<T>> {
    const ctx = this.ctx;
    if (!ctx) {
        throw new Error(
            "HttpContext is not available on the request. Make sure you are using this macro in an HTTP request context.",
        );
    }

    try {
        return schema.parse(this.body());
    } catch (e) {
        if (e instanceof z.ZodError) {
            const formattedErrors = Object.fromEntries(
                e.issues.map(({ path, message }) => [path[0], message]),
            );
            ctx.session.flash("errors", formattedErrors);
            return ctx.response.redirect().back();
        }

        throw e;
    }
});
