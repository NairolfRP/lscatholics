import vine from '@vinejs/vine'
import db from '@adonisjs/lucid/services/db'
import type User from '#users/models/user'
import Role from '#roles/models/role'

const rolesExistsInDb = vine.createRule(async (values, _options, field) => {
  if (!Array.isArray(values)) return

  const result = await db.from('roles').count('id', 'total').whereIn('id', values)
  const total = result[0].total

  if (total !== values.length) {
    field.report('Un ou plusieurs rôles sélectionnés sont invalides.', 'existsAllInDb', field)
  }
})

const notHigherRoleThanCurrentUser = vine.createRule(async (values, _options, field) => {
  if (!Array.isArray(values)) return

  const currentUser = field.meta.currentUser as User
  const target = field.meta.target as User

  await currentUser.load('roles')
  await target.load('roles')

  const currentUserMinOrder = Math.min(...currentUser.roles.map((r) => r.hierarchyOrder))
  const existingRoleIds = target.roles.map((r) => r.id)

  const addedRoleIds = values.filter((id) => !existingRoleIds.includes(id))
  const removedRoleIds = existingRoleIds.filter((id) => !values.includes(id))

  const roleIdsToCheck = [...addedRoleIds, ...removedRoleIds]
  if (roleIdsToCheck.length === 0) return

  const rolesToCheck = await Role.query().whereIn('id', roleIdsToCheck)
  const rolesMinOrder = Math.min(...rolesToCheck.map((r) => r.hierarchyOrder))

  if (rolesMinOrder <= currentUserMinOrder) {
    field.report(
      'Vous ne pouvez pas modifier des rôles supérieurs ou égaux au vôtre.',
      'notHigherThanCurrentUser',
      field
    )
  }
})

export const updateDashboardUserValidator = vine.create(
  vine.object({
    roles: vine
      .array(vine.number().withoutDecimals().nonNegative())
      .use(rolesExistsInDb())
      .use(notHigherRoleThanCurrentUser()),
  })
)
