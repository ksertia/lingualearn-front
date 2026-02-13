import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiService } from '~/services/api'
import type { CreateUserPayload, User } from '~/types/user'

export const useUserStore = defineStore('user', () => {
  const apiService = useApiService()

  // State
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // -----------------------
  // FETCH USERS
  // -----------------------
  async function fetchUsers() {
    const token = useCookie('token').value
    if (!token) console.warn('No token found in cookies, API call might fail')

    isLoading.value = true
    error.value = null

    try {
      const response: any = await apiService.getUsers()

      // Extraction flexible des données
      let data: User[] | null = null
      if (Array.isArray(response)) data = response
      else if (response?.data) {
        if (Array.isArray(response.data)) data = response.data
        else if (Array.isArray(response.data.users)) data = response.data.users
        else if (Array.isArray(response.data.data)) data = response.data.data
      } else if (Array.isArray(response.users)) data = response.users

      if (data) users.value = data
      else error.value = 'Format de réponse invalide'
    } catch (err: any) {
      console.error('Fetch users error:', err)
      error.value = err?.data?.message || err?.message || 'Erreur lors de la récupération des utilisateurs'
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
        accountType: userData.accountType ?? 'teacher'
      }

      if (userData.phone?.trim()) payload.phone = userData.phone.trim()
      if (userData.username) payload.username = userData.username
      if (userData.parentId) payload.parentId = userData.parentId

      const response: any = await apiService.createUser(payload)

      if (response?.success !== false) await fetchUsers()
      else error.value = response.message || 'Erreur lors de la création'
    } catch (err: any) {
      console.error('Create user error:', err)
      error.value = err?.data?.message || err?.message || 'Erreur lors de la création'
    } finally {
      isLoading.value = false
    }
  }

  // -----------------------
  // UPDATE USER
  // -----------------------
  // 
  

  // -----------------------
// PUT USER
// -----------------------
async function putUser(id: string, userData: any) {
  isLoading.value = true
  error.value = null

  try {
    const response: any = await apiService.putUser(id, {
      username: userData.username,
      email: userData.email
    })

    if (response?.success !== false) {
      await fetchUsers()
    } else {
      error.value = response.message || 'Erreur lors de la mise à jour'
    }
  } catch (err: any) {
    console.error('Put user error:', err)
    error.value = err?.data?.message || err?.message || 'Erreur lors de la mise à jour'
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
      const response: any = await apiService.deleteUser(id)
      if (response.success) await fetchUsers()
      else error.value = response.message || 'Erreur lors de la suppression'
    } catch (err: any) {
      console.error('Delete user error:', err)
      error.value = err?.data?.message || err?.message || 'Erreur lors de la suppression'
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
    // updateUser,
    putUser,
    deleteUser
  }
})
