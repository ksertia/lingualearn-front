import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiService } from '~/services/api'
import type { DashboardData, StatTotalResponse, UsersTotalParams } from '~/types/dashboard'

const DEMO_STATS: DashboardData = {
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

const toTotal = (response?: StatTotalResponse) => {
    const data = response?.data as { total?: number } | number | undefined
    if (typeof data === 'number' && Number.isFinite(data)) return data
    if (typeof data?.total === 'number' && Number.isFinite(data.total)) return data.total
    return 0
}

const safeTotal = async (promise: Promise<StatTotalResponse>) => {
    try {
        const response = await promise
        return response?.success ? toTotal(response) : 0
    } catch {
        return 0
    }
}

export const useDashboardStore = defineStore('dashboard', () => {
    const apiService = useApiService()

    const stats = ref<DashboardData | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    async function fetchDashboardData() {
        isLoading.value = true
        error.value = null
        try {
            const getUsersTotal = (params?: UsersTotalParams) => {
                return safeTotal(apiService.getDashboardData(params))
            }

            const [
                usersTotal,
                usersActive,
                usersVerified,
                usersAdmin,
                usersSubAccounts,
                usersWithSubscription,
                learningPaths,
                steps,
                lessons,
                quizzes,
                levels
            ] = await Promise.all([
                getUsersTotal(),
                getUsersTotal({ isActive: true }),
                getUsersTotal({ isVerified: true }),
                getUsersTotal({ userType: 'admin' }),
                getUsersTotal({ userType: 'sub_account_learner' }),
                getUsersTotal({ withSubscription: true }),
                safeTotal(apiService.getAllLearningPathsDashboard()),
                safeTotal(apiService.getAllStepsDashboard()),
                safeTotal(apiService.getAllLessonDashboard()),
                safeTotal(apiService.getAllQuizzesDashboard()),
                safeTotal(apiService.getAllLevelsDashboard())
            ])

            stats.value = {
                users: {
                    total: usersTotal,
                    active: usersActive,
                    verified: usersVerified,
                    admin: usersAdmin,
                    subAccounts: usersSubAccounts,
                    withSubscription: usersWithSubscription
                },
                learningPaths,
                levels,
                steps,
                lessons,
                exercises: 0,
                stepQuizzes: quizzes
            }
        } catch (err: any) {
            console.warn('Backend indisponible (500), chargement des données de démo...')
            stats.value = DEMO_STATS
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
