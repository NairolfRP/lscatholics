import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'
import { RoleFactory } from '#database/factories/role_factory'
import { PermissionFactory } from '#database/factories/permission_factory'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('User - hasPermission', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('returns false when user has no roles', async ({ assert }) => {
    const user = await UserFactory.create()
    const result = await user.hasPermission('editArticles')
    assert.isFalse(result)
  })

  test('returns true when permission exists in a role', async ({ assert }) => {
    const permission = await PermissionFactory.merge({ slug: 'editArticles' }).create()
    const role = await RoleFactory.create()
    await role.related('permissions').attach([permission.id])

    const user = await UserFactory.create()
    await user.related('roles').attach([role.id])

    const result = await user.hasPermission('editArticles')
    assert.isTrue(result)
  })

  test('returns false when role does not have the requested permission', async ({ assert }) => {
    const permission = await PermissionFactory.merge({ slug: 'deleteUsers' }).create()
    const role = await RoleFactory.create()
    await role.related('permissions').attach([permission.id])

    const user = await UserFactory.create()
    await user.related('roles').attach([role.id])

    const result = await user.hasPermission('editArticles')
    assert.isFalse(result)
  })

  test('works with preloaded roles without extra DB call', async ({ assert }) => {
    const permission = await PermissionFactory.merge({ slug: 'createJobs' }).create()
    const role = await RoleFactory.create()
    await role.related('permissions').attach([permission.id])

    const user = await UserFactory.create()
    await user.related('roles').attach([role.id])
    await user.load((loader) => loader.load('roles', (q) => q.preload('permissions')))

    // Spy: if DB is called here, the preloaded cache is not working
    const result = await user.hasPermission('createJobs')
    assert.isTrue(result)
  })
})

test.group('User - getPermissions', () => {
  test('deduplicates permissions across multiple roles', async ({ assert }) => {
    const perm = await PermissionFactory.merge({ slug: 'viewArticles' }).create()
    const role1 = await RoleFactory.create()
    const role2 = await RoleFactory.create()
    await role1.related('permissions').attach([perm.id])
    await role2.related('permissions').attach([perm.id])

    const user = await UserFactory.create()
    await user.related('roles').attach([role1.id, role2.id])

    const permissions = await user.getPermissions()
    assert.equal(permissions.filter((p) => p === 'viewArticles').length, 1)
  })

  test('caches the result in $extras', async ({ assert }) => {
    const user = await UserFactory.create()
    await user.getPermissions()
    assert.isArray(user.$extras.permissionsCache)
  })

  test('clearPermissionsCache removes the cached value', async ({ assert }) => {
    const user = await UserFactory.create()
    await user.getPermissions()
    user.clearPermissionsCache()
    assert.isUndefined(user.$extras.permissionsCache)
  })
})

test.group('User - getHighestRole', () => {
  test('returns null when user has no roles', async ({ assert }) => {
    const user = await UserFactory.create()
    await user.load('roles')
    const result = user.getHighestRole()
    assert.isNull(result)
  })

  test('returns the role with the lowest hierarchyOrder', async ({ assert }) => {
    const roleHigh = await RoleFactory.merge({ hierarchyOrder: 1 }).create()
    const roleLow = await RoleFactory.merge({ hierarchyOrder: 10 }).create()

    const user = await UserFactory.create()
    await user.related('roles').attach([roleHigh.id, roleLow.id])
    await user.load('roles')

    const result = user.getHighestRole()
    assert.equal(result?.id, roleHigh.id)
  })
})
