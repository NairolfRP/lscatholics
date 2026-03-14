import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#roles/models/permission'

export default class extends BaseSeeder {
  async run() {
    const uniqueKey = 'name'

    await Permission.updateOrCreateMany(uniqueKey, [
      {
        name: 'Dashboard Access',
        slug: 'dashboardAccess',
        description: 'Can access the dashboard',
      },
      {
        name: 'View Articles',
        slug: 'viewArticles',
        description: 'Can view posts in dashboard',
      },
      {
        name: 'Create Articles',
        slug: 'createArticles',
        description: 'Can create new posts',
      },
      {
        name: 'Edit Articles',
        slug: 'editArticles',
        description: 'Can edit existing posts',
      },
      {
        name: 'Delete Articles',
        slug: 'deleteArticles',
        description: 'Can delete posts',
      },
      {
        name: 'Manage Events',
        slug: 'manageEvents',
        description: 'Can manage events',
      },
      {
        name: 'Manage Users',
        slug: 'manageUsers',
        description: 'Can manage users and permissions',
      },
      {
        name: 'Delete Users',
        slug: 'deleteUsers',
        description: 'Can delete users',
      },
      {
        name: 'View Job Offers',
        slug: 'viewJobs',
        description: 'Can view new jobs in dashboard',
      },
      {
        name: 'Create Job Offer',
        slug: 'createJobs',
        description: 'Can create new jobs',
      },
      {
        name: 'Edit Job Offer',
        slug: 'editJobs',
        description: 'Can edit existing jobs',
      },
      {
        name: 'Delete Job Offer',
        slug: 'deleteJobs',
        description: 'Can delete jobs',
      },
    ])
  }
}
