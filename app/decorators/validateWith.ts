import { z } from "zod";
import { handleZodError } from "#utils/zodErrorHandler";
import { HttpContext } from "@adonisjs/core/http";

type SchemaGetter = () => z.ZodSchema
type SchemaInput = z.ZodSchema | SchemaGetter | string

export function validateWith(schemaInput: SchemaInput) {
    return function (
        _target: any,
        _propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value

        descriptor.value = async function (ctx: HttpContext) {
            try {
                let schema: z.ZodSchema;

                if(typeof schemaInput === 'function') {
                    schema = schemaInput.call(this);
                } else if(typeof schemaInput === "string") {
                    schema = this[schemaInput as keyof typeof this];
                } else {
                    schema = schemaInput;
                }
                const validatedData = schema.safeParse(ctx.request.body())

                if(!validatedData.success) {
                    const formattedErrors = validatedData.error.issues.reduce(
                        (acc, { path, message }) => ({
                            ...acc,
                            [path[0]]: message,
                        }),
                        {}
                    )

                    ctx.session.flashErrors({ ...formattedErrors });
                }

                return originalMethod.call(this, ctx, validatedData)
            } catch (error) {
                //console.error(error)
                return handleZodError(error, ctx)
            }
        }

        return descriptor
    }
}
