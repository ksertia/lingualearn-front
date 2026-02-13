import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useApiService } from '~/services/api'
import type { BaseProgression, CompleteProgression, ProgressionStats } from '~/types/progression'

const EMPTY_STATS: ProgressionStats = {
    totalLevels: 0,
    completedLevels: 0,
    totalModules: 0,
    completedModules: 0,
    totalPaths: 0,
    completedPaths: 0,
    totalSteps: 0,
    completedSteps: 0,
    overallProgressPercentage: 0,
    totalEstimatedHours: 0,
    completedEstimatedHours: 0
}

const ENABLE_BASE_PROGRESSION = true
const ENABLE_COMPLETE_PROGRESSION = true

const toNumber = (value: unknown) => {
    return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

const normalizeStats = (data?: Partial<ProgressionStats> | null): ProgressionStats => ({
    totalLevels: toNumber(data?.totalLevels),
    completedLevels: toNumber(data?.completedLevels),
    totalModules: toNumber(data?.totalModules),
    completedModules: toNumber(data?.completedModules),
    totalPaths: toNumber(data?.totalPaths),
    completedPaths: toNumber(data?.completedPaths),
    totalSteps: toNumber(data?.totalSteps),
    completedSteps: toNumber(data?.completedSteps),
    overallProgressPercentage: toNumber(data?.overallProgressPercentage),
    totalEstimatedHours: toNumber(data?.totalEstimatedHours),
    completedEstimatedHours: toNumber(data?.completedEstimatedHours)
})

export const useProgressionStore = defineStore('progression', () => {
    const api = useApiService()
    const stats = ref<ProgressionStats | null>(null)
    const completeProgression = ref<CompleteProgression | null>(null)
    const baseProgression = ref<BaseProgression | null>(null)
    const isLoading = ref(false)
    const totalXp = computed(() =>
        completeProgression.value?.overallProgress?.totalXp ??
        baseProgression.value?.overallProgress?.totalXp ??
        0
    )

    const initBaseProgression = async (userId: string, languageId: string) => {
        if (!ENABLE_BASE_PROGRESSION) return null
        try {
            const baseRes = await api.getProgression(userId, languageId)
            return baseRes?.success ? (baseRes.data ?? null) : null
        } catch (e) {
            console.warn('Progression init failed.', e)
            return null
        }
    }

    const fetchUserStats = async (userId: string, languageId: string) => {
        isLoading.value = true
        stats.value = null
        completeProgression.value = null
        baseProgression.value = null
        try {
            baseProgression.value = await initBaseProgression(userId, languageId)

            let statsRes: any = null
            try {
                statsRes = await api.getProgressionStats(userId, languageId)
            } catch (e) {
                if (ENABLE_BASE_PROGRESSION) {
                    baseProgression.value = baseProgression.value ?? (await initBaseProgression(userId, languageId))
                    try {
                        statsRes = await api.getProgressionStats(userId, languageId)
                    } catch (err) {
                        console.warn('Progression stats failed after init retry.', err)
                    }
                }
            }

            stats.value = statsRes?.success ? normalizeStats(statsRes.data) : EMPTY_STATS
        } catch (e) {
            console.error('Error fetching progression:', e)
            stats.value = EMPTY_STATS
        } finally {
            isLoading.value = false
        }
    }

    const fetchCompleteProgression = async (userId: string, languageId: string) => {
        if (!ENABLE_COMPLETE_PROGRESSION) {
            completeProgression.value = null
            return
        }
        isLoading.value = true
        try {
            const res = await api.getCompleteProgression(userId, languageId)
            completeProgression.value = res.success ? (res.data ?? null) : null
        } catch (e) {
            console.error('Error fetching complete progression:', e)
        } finally {
            isLoading.value = false
        }
    }

    return { stats, baseProgression, completeProgression, totalXp, isLoading, fetchUserStats, fetchCompleteProgression }
})
