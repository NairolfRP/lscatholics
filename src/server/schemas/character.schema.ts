import z from 'zod'

export const characterIdSchema = z.int().positive()
