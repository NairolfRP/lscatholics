import { createAccessControl } from 'better-auth/plugins'
import { adminAc, defaultStatements, userAc } from 'better-auth/plugins/admin/access'

const statement = {
  ...defaultStatements,
} as const

export const ac = createAccessControl(statement)

export const roles = Object.freeze({
  user: ac.newRole({ ...userAc.statements }),
  admin: ac.newRole({ ...adminAc.statements }),
})
