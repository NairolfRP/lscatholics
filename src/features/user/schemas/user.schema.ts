import { z } from 'zod'
import { allRoles } from '#/shared/constants/roles.ts'

export const userIdSchema = z.object({
  userId: z.uuid(),
})

export const updateUserServerFnSchema = z.object({
  targetId: z.uuid(),
  roles: z.array(z.enum(allRoles)),
})

export const updateUserFormSchema = z.object({
  roles: z
    .array(z.enum(allRoles, { error: 'Rôle(s) invalide(s)' }))
    .min(1, 'Au moins un rôle est requis'),
})
