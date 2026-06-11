import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiService } from '~/services/api'

export const useAppSettingsStore = defineStore('appSettings', () => {
  const apiService = useApiService()

  const settings = ref<Record<string, string>>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSettings() {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiService.getAdminSettings()
      settings.value = response.data ?? {}
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Erreur lors de la récupération des paramètres'
    } finally {
      isLoading.value = false
    }
  }

  async function updateSetting(key: string, value: string) {
    const response = await apiService.updateAdminSetting(key, value)
    settings.value[key] = response.data.value
  }

  async function updateUserTrial(userId: string, expiresAt: string) {
    await apiService.updateUserTrial(userId, expiresAt)
  }

  return {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSetting,
    updateUserTrial,
  }
})
