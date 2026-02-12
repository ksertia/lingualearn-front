import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiService } from '~/services/api'
import type { DashboardData } from '~/types/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
    const apiService = useApiService()

    const stats = ref<DashboardData | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    async function fetchDashboardData() {
        isLoading.value = true
        error.value = null
        try {
            const response = await apiService.getDashboardData()
            if (response.success) {
                stats.value = response.data
            } else {
                throw new Error('Erreur API')
            }
        } catch (err: any) {
            console.warn('Backend indisponible (500), chargement des données de démo...')
            stats.value = {
                users: {
                    total: 1250,
                    active: 890,
                    verified: 1100,
                    admin: 5,
                    subAccounts: 45,
                    withSubscription: 156
                },
                learningPaths: 12,
                levels: 6,
                steps: 45,
                lessons: 128,
                exercises: 256,
                stepQuizzes: 45
            }
        } finally {
            isLoading.value = false
        }
    }

    return {
        stats,
        isLoading,
        error,
        fetchDashboardData
    }
})
