import { departments } from '#/config/departments.ts'

export const getDepartmentTitle = (id: string, shortTitle: boolean = false) => {
  const department = departments.find((dep) => dep.id === id)

  if (!department) {
    return null
  }

  if (shortTitle) {
    return department.shortTitle ? department.shortTitle : department.title
  }

  return department.title
}
