// import type { User as BaseUser } from '../../shared/models/user'

// export type User = BaseUser

// export interface CreateUserPayload {
//   firstName: string
//   lastName: string
//   email: string
//   password: string
//   accountType?: AccountType
//   phone?: string
//   username?: string | null
//   parentId?: string | null
// }
// export type AccountType =
//   | 'admin'
//   | 'learner'
//   | 'sub_account_learner'
//   | 'plateform_manager'
//   | 'teacher'

// export interface UpdateUserPayload {
//   firstName?: string
//   lastName?: string
//   phone?: string
//   email?: string
//   accountType?: AccountType
// }


import type { User as BaseUser } from '../../shared/models/user'

export type User = BaseUser & {
  isActive: boolean
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
  // phone?: string
  // email?: string
  // password?: string
  // accountType?: AccountType
  // isActive?: boolean
}
