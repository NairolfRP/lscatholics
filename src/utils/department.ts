import { departments } from '#/config/departments.ts'
import type {
  Department,
  DepartmentPage,
  DepartmentTeamMember,
} from '#shared/types/department.types.ts'

export type ResolvedDepartment = Omit<Department, 'page'> & {
  page: Omit<DepartmentPage, 'director'> & { director: DepartmentTeamMember }
}

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

export const getDepartmentBySlug = (slug: string): ResolvedDepartment | null => {
  const department = departments.find((dep) => dep.slug === slug)

  if (!department) {
    return null
  }

  const { sameAs } = department.page.director
  let director: DepartmentTeamMember = { position: 'INCONNU' }

  if (sameAs) {
    const source = departments.find((dep) => dep.id === sameAs)?.page.director

    if (source && !('sameAs' in source)) {
      director = source
    }
  } else {
    director = department.page.director
  }

  return {
    ...department,
    page: {
      ...department.page,
      director,
    },
  }
}
