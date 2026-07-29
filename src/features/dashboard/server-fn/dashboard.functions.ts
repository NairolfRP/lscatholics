import { createServerFn } from '@tanstack/react-start'
import { requirePermission } from '#/middleware/permission.middleware'
import * as dashboardService from '../server/dashboard.service'

export const getDashboardStatsFn = createServerFn({ method: 'GET' })
  .middleware([requirePermission('dashboard', 'access')])
  .handler(async () => dashboardService.getDashboardStats())
