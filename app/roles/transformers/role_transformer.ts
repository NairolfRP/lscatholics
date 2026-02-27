import { BaseTransformer } from '@adonisjs/core/transformers'
import type Role from '#roles/models/role'

export default class RoleTransformer extends BaseTransformer<Role> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'slug',
      'name',
      'description',
      'hierarchyOrder',
      'createdAt',
      'updatedAt',
    ])
  }

  minimalDetails() {
    return this.pick(this.resource, ['id', 'slug', 'name', 'hierarchyOrder'])
  }
}
