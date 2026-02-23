import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApiService } from '~/services/api'
import type { User } from '~/types/user'
import type { ApiResponse } from '~/types/learning'


interface UsersListResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

export const useFormateurStore = defineStore('formateur', () => {
  const apiService = useApiService()

  const allUsers = ref<User[]>([])
  const currentFormateur = ref<User | null>(null)
  const isLoading = ref(false)
  const isLoadingDetail = ref(false)
  const error = ref<string | null>(null)
  const errorDetail = ref<string | null>(null)
  const totalFromApi = ref(0)

  const search = ref('')
  const statusFilter = ref<'all' | 'active' | 'suspended'>('all')

  const users = computed(() => {
    let result = allUsers.value

    const term = search.value.trim().toLowerCase()
    if (term) {
      result = result.filter(u => {
        const firstName = (u.profile?.firstName ?? '').toLowerCase()
        const lastName = (u.profile?.lastName ?? '').toLowerCase()
        const email = (u.email ?? '').toLowerCase()
        const username = (u.username ?? '').toLowerCase()
        return (
          firstName.includes(term) ||
          lastName.includes(term) ||
          email.includes(term) ||
          username.includes(term)
        )
      })
    }

    if (statusFilter.value === 'active') {
      result = result.filter(u => u.isActive)
    } else if (statusFilter.value === 'suspended') {
      result = result.filter(u => !u.isActive)
    }

    return result
  })

  const statsSummary = computed(() => ({
    total: totalFromApi.value,
    active: allUsers.value.filter(u => u.isActive).length,
    suspended: allUsers.value.filter(u => !u.isActive).length,
    withReports: allUsers.value.filter(u => (u as any).reports?.length > 0).length
  }))

  const pagination = computed(() => ({
    page: 1,
    limit: allUsers.value.length,
    total: totalFromApi.value
  }))

  function setSearch(value: string) {
    search.value = value
  }

  function setStatusFilter(value: 'all' | 'active' | 'suspended') {
    statusFilter.value = value
  }

  async function fetchFormateurUsers() {
    isLoading.value = true
    error.value = null

    try {
      
      const response: ApiResponse<UsersListResponse> =
        await apiService.getFilterUsers({ accountType: 'teacher' })

      if (response.success && response.data) {
        allUsers.value = response.data.users ?? []
        totalFromApi.value = response.data.pagination?.total ?? allUsers.value.length
      } else {
        error.value = 'Impossible de charger les formateurs'
      }
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Erreur réseau'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchFormateurDetail(id: string) {
    isLoadingDetail.value = true
    errorDetail.value = null
    currentFormateur.value = null

    try {
      const response: any = await apiService.getUserById(id)

      if (response.success && response.data) {
        currentFormateur.value = response.data?.user ?? response.data
      } else if (!response.success && response.id) {
        
        currentFormateur.value = response
      } else {
        errorDetail.value = 'Impossible de charger les détails du formateur'
      }
    } catch (err: any) {
      errorDetail.value = err?.data?.message || err?.message || 'Erreur lors du chargement'
    } finally {
      isLoadingDetail.value = false
    }
  }

  async function suspendFormateur(id: string) {
    try {
      await apiService.updateUser(id, { isActive: false })
      if (currentFormateur.value?.id === id) {
        currentFormateur.value.isActive = false
      }
      const user = allUsers.value.find(u => u.id === id)
      if (user) user.isActive = false
      return true
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Erreur'
      return false
    }
  }

  async function reactivateFormateur(id: string) {
    try {
      await apiService.updateUser(id, { isActive: true })
      if (currentFormateur.value?.id === id) {
        currentFormateur.value.isActive = true
      }
      const user = allUsers.value.find(u => u.id === id)
      if (user) user.isActive = true
      return true
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Erreur'
      return false
    }
  }

  return {
    users,          
    currentFormateur,
    pagination,
    statsSummary,
    isLoading,
    isLoadingDetail,
    error,
    errorDetail,
    search,
    statusFilter,
    setSearch,
    setStatusFilter,
    fetchFormateurUsers,
    fetchFormateurDetail,
    suspendFormateur,
    reactivateFormateur
  }
})