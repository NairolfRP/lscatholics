import { createAccessControl } from 'better-auth/plugins'
import { adminAc, defaultStatements, userAc } from 'better-auth/plugins/admin/access'

const statement = {
  ...defaultStatements,
  dashboard: ['access', 'supervise', 'manage'],
  post: ['create', 'read', 'update', 'delete'],
  event: ['create', 'read', 'update', 'delete'],
  job: ['create', 'read', 'update', 'delete'],
} as const

export const ac = createAccessControl(statement)

export const ROLE_PERMISSIONS = {
  user: {
    ...userAc.statements,
  },
  admin: {
    ...adminAc.statements,
    dashboard: ['access', 'supervise', 'manage'],
    post: ['create', 'read', 'update', 'delete'],
    event: ['create', 'read', 'update', 'delete'],
    job: ['create', 'read', 'update', 'delete'],
  },
} as const

export const roles = Object.freeze({
  user: ac.newRole(ROLE_PERMISSIONS.user),
  admin: ac.newRole(ROLE_PERMISSIONS.admin),
})
