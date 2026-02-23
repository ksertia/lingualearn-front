import type { User as BaseUser } from '../../shared/models/user'

export type User = BaseUser & {
  isActive: boolean
  password?: string
}

export interface CreateUserPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  accountType?: AccountType
  phone?: string
  username?: string | null
  parentId?: string | null
}

export type AccountType =
  | 'admin'
  | 'learner'
  | 'sub_account_learner'
  | 'plateform_manager'
  | 'teacher'

export interface UpdateUserPayload {
  firstName?: string
  lastName?: string
  phone?: string
  username?: string
  email?: string
  password?: string
  accountType?: AccountType
  isActive?: boolean
  profile?: {
    firstName?: string
    lastName?: string
    [key: string]: any
  }
}

export interface UserFilter {
  country?: string
  language?: string
  level?: string
  accountType?: string
  minAge?: number
  maxAge?: number
  search?: string
  page?: number
  limit?: number
}
