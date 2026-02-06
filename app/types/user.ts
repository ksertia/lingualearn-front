import type { User as BaseUser } from '../../shared/models/user'

export type User = BaseUser

export interface CreateUserPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  accountType: AccountType
}
export type AccountType = 'admin' | 'plateform_manager' | 'teacher'

export interface UpdateUserPayload {
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
  accountType: AccountType
}
