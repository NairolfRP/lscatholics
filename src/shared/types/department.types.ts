import type { DEPARTMENT } from '#shared/constants/department.ts'

export type DepartmentId = (typeof DEPARTMENT)[keyof typeof DEPARTMENT]

export type DepartmentCategory = 'curia' | 'services' | 'charities'

export type Department = {
  id: DepartmentId
  slug: string
  shortTitle?: string
  title: string
  description: string
  category: DepartmentCategory
  page: DepartmentPage
}

export type DepartmentTeamMember =
  | {
      position: string
      name?: never
      phone?: never
      image?: never
    }
  | {
      position: string
      name: string
      phone?: string
      image?: string
    }

export type DepartmentDirector =
  | (DepartmentTeamMember & { sameAs?: never })
  | ({ sameAs: DepartmentId } & Partial<Record<keyof DepartmentTeamMember, never>>)

export type DepartmentTeam = {
  title: string
  members: DepartmentTeamMember[]
}

export type DepartmentPage = {
  banner?:
    | {
        image: string
        color?: never
      }
    | {
        image?: never
        color: string
      }
  content?: string[]
  director: DepartmentDirector
  teams?: DepartmentTeam[]
}
