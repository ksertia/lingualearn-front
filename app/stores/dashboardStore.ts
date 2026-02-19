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
        user: 16,
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
    const data = response?.data
    if (typeof data === 'number') {
        return Number.isFinite(data) ? data : 0
    }
    if (data && typeof data === 'object' && 'total' in data && typeof data.total === 'number') {
        return Number.isFinite(data.total) ? data.total : 0
    }
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
                usersUser,
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
                getUsersTotal({ userType: 'sub_account' }),
                getUsersTotal({ userType: 'user' }),
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
                    user: usersUser,
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

    const engagementRate = computed(() => {
        if (!stats.value || stats.value.users.total === 0) return 0
        return Math.round((stats.value.users.active / stats.value.users.total) * 100)
    })

    const conversionRate = computed(() => {
        if (!stats.value || stats.value.users.total === 0) return 0
        return Math.round((stats.value.users.withSubscription / stats.value.users.total) * 100)
    })

    const verificationRate = computed(() => {
        if (!stats.value || stats.value.users.total === 0) return 0
        return Math.round((stats.value.users.verified / stats.value.users.total) * 100)
    })

    const contentDensity = computed(() => {
        if (!stats.value || stats.value.learningPaths === 0) return '0'
        return (stats.value.lessons / stats.value.learningPaths).toFixed(1)
    })

    return {
        stats,
        isLoading,
        error,
        fetchDashboardData,
        engagementRate,
        conversionRate,
        verificationRate,
        contentDensity
    }
})
