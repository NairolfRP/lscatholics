import { z } from "zod";
import { HttpContext } from "@adonisjs/core/http";

export const handleZodError = (error: unknown, ctx: HttpContext) => {
    if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.reduce(
            (acc, { path, message }) => ({
                ...acc,
                [path[0]]: message,
            }),
            {},
        );

        ctx.session.flash("errors", formattedErrors);

        return ctx.response.redirect().back();
    }

    throw error;
};

export const validateRequest = async <T extends z.ZodSchema>(
    schema: T,
    data: unknown,
): Promise<z.SafeParseReturnType<T, Record<keyof T, string>>> => {
    return schema.parse(data);
};
