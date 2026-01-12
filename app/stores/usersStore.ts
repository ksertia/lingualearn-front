import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../../shared/models/user'

export const useUsersStore = defineStore('users', () => {
    // State
    const users = ref<User[]>([])
    const currentUser = ref<User | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const STORAGE_KEY = 'lingualearn_current_user'

    const rememberUser = (user: User | null, remember: boolean) => {
        if (typeof window === 'undefined') return

        if (remember && user) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        } else {
            window.localStorage.removeItem(STORAGE_KEY)
        }
    }

    const hydrateFromStorage = () => {
        if (typeof window === 'undefined') return

        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (!raw) return

        try {
            const saved = JSON.parse(raw) as User
            currentUser.value = saved

            if (!users.value.find((u) => u.id === saved.id)) {
                users.value.push(saved)
            }
        } catch {
            window.localStorage.removeItem(STORAGE_KEY)
        }
    }

    // Getters
    const isAuthenticated = computed(() => currentUser.value !== null)
    const isParent = computed(() => currentUser.value?.accountType === 'parent')
    const isChild = computed(() => currentUser.value?.accountType === 'child')
    const isTeacher = computed(() => currentUser.value?.accountType === 'teacher')
    const isAdmin = computed(() => currentUser.value?.accountType === 'admin')

    // Actions
    const register = async (userData: Partial<User>) => {
        isLoading.value = true
        error.value = null

        try {
            // Simuler l'inscription API
            const newUser: User = {
                id: crypto.randomUUID(),
                accountType: userData.accountType || 'child',
                email: userData.email,
                phone: userData.phone,
                username: userData.username!,
                isVerified: false,
                isActive: true,
                createdAt: new Date(),
                lastLogin: new Date(),
                lastActive: new Date(),
                profile: {
                    firstName: userData.profile?.firstName || '',
                    lastName: userData.profile?.lastName || '',
                    displayName: userData.profile?.displayName,
                    birthDate: userData.profile?.birthDate,
                    avatarUrl: userData.profile?.avatarUrl,
                    avatarColor: userData.profile?.avatarColor || '#3B82F6',
                    timezone: userData.profile?.timezone || 'Europe/Paris',
                    preferredLanguage: userData.profile?.preferredLanguage || 'fr',
                    gender: userData.profile?.gender,
                    bio: userData.profile?.bio,
                    location: userData.profile?.location,
                    websiteUrl: userData.profile?.websiteUrl,
                    socialLinks: userData.profile?.socialLinks,
                    customFields: userData.profile?.customFields,
                    settings: userData.profile?.settings
                },
                stats: {
                    totalXp: 0,
                    totalCoins: 0,
                    currentStreak: 0,
                    longestStreak: 0,
                    totalStudyMinutes: 0,
                    totalGamesPlayed: 0,
                    totalExercisesCompleted: 0,
                    totalLessonsCompleted: 0,
                    totalCoursesCompleted: 0,
                    totalTracksCompleted: 0,
                    totalLevelsCompleted: 0,
                    totalCertificatesEarned: 0,
                    totalBadgesEarned: 0,
                    currentXpLevel: 1
                },
                languageProgress: [],
                notifications: {
                    email: true,
                    push: true,
                    assignments: true,
                    grades: true,
                    announcements: true,
                    progress: true,
                    achievements: true,
                    reminders: true
                }
            }

            users.value.push(newUser)
            currentUser.value = newUser

            return { success: true, user: newUser }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors de l\'inscription'
            return { success: false, error: error.value }
        } finally {
            isLoading.value = false
        }
    }

    const login = async (credentials: { username: string; password: string }) => {
        isLoading.value = true
        error.value = null

        try {
            // Simuler la connexion API
            const user = users.value.find((u: User) =>
                u.username === credentials.username && u.isActive
            )

            if (!user) {
                throw new Error('Identifiants incorrects')
            }

            // Mettre à jour lastLogin
            user.lastLogin = new Date()
            user.lastActive = new Date()

            currentUser.value = user

            return { success: true, user }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors de la connexion'
            return { success: false, error: error.value }
        } finally {
            isLoading.value = false
        }
    }

    const logout = () => {
        currentUser.value = null
        error.value = null
    }

    const updateUser = async (updates: Partial<User>) => {
        if (!currentUser.value) return { success: false, error: 'Utilisateur non connecté' }

        isLoading.value = true
        error.value = null

        try {
            // Mettre à jour l'utilisateur courant
            Object.assign(currentUser.value, updates)

            // Mettre à jour dans la liste des utilisateurs
            const index = users.value.findIndex((u: User) => u.id === currentUser.value!.id)
            if (index !== -1) {
                users.value[index] = { ...currentUser.value }
            }

            return { success: true, user: currentUser.value }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
            return { success: false, error: error.value }
        } finally {
            isLoading.value = false
        }
    }

    const addChild = async (childData: Partial<User>) => {
        if (!currentUser.value || !isParent.value) {
            return { success: false, error: 'Seuls les parents peuvent ajouter des enfants' }
        }

        isLoading.value = true
        error.value = null

        try {
            const result = await register({
                ...childData,
                accountType: 'child',
                parentId: currentUser.value.id
            })

            if (result.success && result.user) {
                // Ajouter la relation familiale
                if (!currentUser.value.familyRelationships) {
                    currentUser.value.familyRelationships = { children: [], parents: [] }
                }
                currentUser.value.familyRelationships.children?.push({
                    childId: result.user.id,
                    relationshipType: 'child',
                    permissions: {
                        view_progress: true,
                        set_limits: true,
                        award_rewards: true
                    },
                    isActive: true,
                    addedAt: new Date()
                })
            }

            return result
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erreur lors de l\'ajout de l\'enfant'
            return { success: false, error: error.value }
        } finally {
            isLoading.value = false
        }
    }

    const getChildren = computed(() => {
        if (!currentUser.value?.familyRelationships?.children) return []

        return currentUser.value.familyRelationships.children
            .filter((child: any) => child.isActive)
            .map((child: any) => users.value.find((u: User) => u.id === child.childId))
            .filter(Boolean) as User[]
    })

    const addUser = (user: User) => {
        users.value.push(user)
    }

    const clearError = () => {
        error.value = null
    }

    // Hydratation côté client au chargement
    if (typeof window !== 'undefined') {
        hydrateFromStorage()
    }

    return {
        // State
        users,
        currentUser,
        isLoading,
        error,

        // Getters
        isAuthenticated,
        isParent,
        isChild,
        isTeacher,
        isAdmin,
        getChildren,

        // Actions
        register,
        login,
        logout,
        updateUser,
        addChild,
        addUser,
        clearError,
        rememberUser
    }
})
