import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiService } from '~/services/api'

export const useProgressionStore = defineStore('progression', () => {
    const api = useApiService()
    const stats = ref<any>(null)
    const completeProgression = ref<any>(null)
    const isLoading = ref(false)

    const fetchUserStats = async (userId: string, languageId: string) => {
        isLoading.value = true
        try {
            const res = await api.getProgressionStats(userId, languageId)
            stats.value = res.data
        } catch (e) {
            console.error('Error fetching stats:', e)
        } finally {
            isLoading.value = false
        }
    }

    const fetchCompleteProgression = async (userId: string, languageId: string) => {
        isLoading.value = true
        try {
            const res = await api.getCompleteProgression(userId, languageId)
            completeProgression.value = res.data
        } catch (e) {
            console.error('Error fetching complete progression:', e)
        } finally {
            isLoading.value = false
        }
    }

    return { stats, completeProgression, isLoading, fetchUserStats, fetchCompleteProgression }
})
