// import { defineStore } from 'pinia'
// import { ref } from 'vue'
// import { useApiService } from '~/services/api'
// import type { User } from '~/types/auth'
// import type { CreateUserPayload } from '~/types/user'
// import type { ApiResponse } from '~/types/learning'

// export const useUserStore = defineStore('user', () => {
//   const apiService = useApiService()

//   // -----------------------
//   // STATE
//   // -----------------------
//   const users = ref<User[]>([])
//   const isLoading = ref(false)
//   const error = ref<string | null>(null)

//   // -----------------------
//   // FETCH USERS
//   // -----------------------
//   async function fetchUsers() {
//     isLoading.value = true
//     error.value = null

//     try {
//       const response: ApiResponse<User[]> = await apiService.getUsers()

//       if (response.success && response.data) {
//         users.value = response.data
//       } else {
//         error.value = 'Format de réponse invalide'
//       }
//     } catch (err: any) {
//       console.error('Fetch users error:', err)
//       error.value =
//         err?.data?.message ||
//         err?.message ||
//         'Erreur lors de la récupération des utilisateurs'
//     } finally {
//       isLoading.value = false
//     }
//   }

//   // -----------------------
//   // CREATE USER
//   // -----------------------
//   async function createUser(userData: CreateUserPayload) {
//     isLoading.value = true
//     error.value = null

//     try {
//       const payload: CreateUserPayload = {
//         firstName: userData.firstName.trim(),
//         lastName: userData.lastName.trim(),
//         email: userData.email.trim(),
//         password: userData.password,
//         accountType: userData.accountType ?? 'teacher',
//         phone: userData.phone?.trim(),
//         username: userData.username,
//         parentId: userData.parentId
//       }

//       const response: ApiResponse<User> =
//         await apiService.createUser(payload)

//       if (response.success) {
//         await fetchUsers()
//       } else {
//         error.value = 'Erreur lors de la création'
//       }
//     } catch (err: any) {
//       console.error('Create user error:', err)
//       error.value =
//         err?.data?.message ||
//         err?.message ||
//         'Erreur lors de la création'
//     } finally {
//       isLoading.value = false
//     }
//   }

//   // -----------------------
//   // UPDATE USER
//   // -----------------------
//   async function putUser(id: string, userData: UpdateUserPayload) {
//   isLoading.value = true
//   error.value = null

//   try {
//     const response: ApiResponse<User> = await apiService.updateUser(id, userData)

//     if (response.success) {
//       await fetchUsers()
//     } else {
//       error.value = 'Erreur lors de la mise à jour'
//     }
//   } catch (err: any) {
//     console.error('Put user error:', err)
//     error.value =
//       err?.data?.message ||
//       err?.message ||
//       'Erreur lors de la mise à jour'
//   } finally {
//     isLoading.value = false
//   }
// }


//   // -----------------------
//   // DELETE USER
//   // -----------------------
//   async function deleteUser(id: string) {
//     isLoading.value = true
//     error.value = null

//     try {
//       const response: ApiResponse<void> =
//         await apiService.deleteUser(id)

//       if (response.success) {
//         await fetchUsers()
//       } else {
//         error.value = 'Erreur lors de la suppression'
//       }
//     } catch (err: any) {
//       console.error('Delete user error:', err)
//       error.value =
//         err?.data?.message ||
//         err?.message ||
//         'Erreur lors de la suppression'
//     } finally {
//       isLoading.value = false
//     }
//   }

//   return {
//     users,
//     isLoading,
//     error,
//     fetchUsers,
//     createUser,
//     putUser,
//     deleteUser
//   }
// })


import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiService } from '~/services/api'
import type { UpdateUserPayload } from '~/types/user'
import type { User } from '~/types/auth'
import type { CreateUserPayload } from '~/types/user'
import type { ApiResponse } from '~/types/learning'

interface UsersListResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

export const useUserStore = defineStore('user', () => {
  const apiService = useApiService()

  // -----------------------
  // STATE
  // -----------------------
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // -----------------------
  // FETCH USERS
  // -----------------------
  async function fetchUsers() {
    isLoading.value = true
    error.value = null

    try {
      const response: ApiResponse<UsersListResponse> =
        await apiService.getUsers()

      if (response.success && response.data) {
        users.value = response.data.users ?? []
      } else {
        error.value = 'Format de réponse invalide'
      }
    } catch (err: any) {
      console.error('Fetch users error:', err)
      error.value =
        err?.data?.message ||
        err?.message ||
        'Erreur lors de la récupération des utilisateurs'
    } finally {
      isLoading.value = false
    }
  }

  // -----------------------
  // CREATE USER
  // -----------------------
  async function createUser(userData: CreateUserPayload) {
    isLoading.value = true
    error.value = null

    try {
      const payload: CreateUserPayload = {
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.trim(),
        password: userData.password,
        accountType: userData.accountType ?? 'teacher',
        phone: userData.phone?.trim(),
        username: userData.username,
        parentId: userData.parentId
      }

      const response: ApiResponse<User> =
        await apiService.createUser(payload)

      if (response.success) {
        await fetchUsers()
      } else {
        error.value = 'Erreur lors de la création'
      }
    } catch (err: any) {
      console.error('Create user error:', err)
      error.value =
        err?.data?.message ||
        err?.message ||
        'Erreur lors de la création'
    } finally {
      isLoading.value = false
    }
  }

  // -----------------------
  // UPDATE USER
  // -----------------------
 // -----------------------
// UPDATE USER
// -----------------------
async function putUser(id: string, userData: UpdateUserPayload) {
  isLoading.value = true
  error.value = null

  try {
    const response: ApiResponse<User> =
      await apiService.updateUser(id, userData)

    if (response.success) {
      await fetchUsers()
    } else {
      error.value = 'Erreur lors de la mise à jour'
    }
  } catch (err: any) {
    console.error('Put user error:', err)
    error.value =
      err?.data?.message ||
      err?.message ||
      'Erreur lors de la mise à jour'
  } finally {
    isLoading.value = false
  }
}


  // -----------------------
  // DELETE USER
  // -----------------------
  async function deleteUser(id: string) {
    isLoading.value = true
    error.value = null

    try {
      // ⚡ Cast temporaire si TypeScript continue à souligner
      const response: ApiResponse<void> =
        await (apiService as any).deleteUser(id)

      if (response.success) {
        await fetchUsers()
      } else {
        error.value = 'Erreur lors de la suppression'
      }
    } catch (err: any) {
      console.error('Delete user error:', err)
      error.value =
        err?.data?.message ||
        err?.message ||
        'Erreur lors de la suppression'
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser,
    putUser,
    deleteUser
  }
})
