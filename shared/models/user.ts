export interface User {
    id: string
    parentId?: string
    accountType: 'admin' | 'plateform_manager' | 'teacher' | 'learner'
    email?: string
    phone?: string
    username: string
    isVerified: boolean
    isActive: boolean
    subscriptionId?: string
    subscriptionEndsAt?: Date
    createdAt: Date
    lastLogin?: Date
    lastActive?: Date
    firstName: string
    lastName: string

    profile: {
        firstName: string
        lastName: string
        displayName?: string
        birthDate?: Date
        avatarUrl?: string
        avatarColor?: string
        timezone: string
        preferredLanguage: string
        gender?: string
        bio?: string
        location?: string
        websiteUrl?: string
        socialLinks?: Record<string, string>
        customFields?: Record<string, any>
        settings?: Record<string, any>
    }

    subscription?: {
        id: string
        planId: string
        status: 'active' | 'canceled' | 'expired' | 'pending'
        billingCycle: 'monthly' | 'yearly'
        currentPeriodStart: Date
        currentPeriodEnd: Date
        cancelAtPeriodEnd: boolean
        canceledAt?: Date
        stripeSubscriptionId?: string
        stripeCustomerId?: string
    }

    stats: {
        totalXp: number
        totalCoins: number
        currentStreak: number
        longestStreak: number
        totalStudyMinutes: number
        totalGamesPlayed: number
        totalExercisesCompleted: number
        totalLessonsCompleted: number
        totalCoursesCompleted: number
        totalTracksCompleted: number
        totalLevelsCompleted: number
        totalCertificatesEarned: number
        totalBadgesEarned: number
        currentXpLevel: number
        accuracyRate?: number
    }

    languageProgress: Array<{
        languageId: string
        currentLevelId?: string
        status: 'not_started' | 'in_progress' | 'completed'
        overallProgress: number
        totalXp: number
        totalTimeMinutes: number
        lastAccessedAt?: Date
        startedAt?: Date
        completedAt?: Date
    }>

    familyRelationships?: {
        children?: Array<{
            childId: string
            relationshipType: 'child' | 'student' | 'ward'
            permissions: Record<string, boolean>
            isActive: boolean
            addedAt: Date
        }>
        parents?: Array<{
            parentId: string
            relationshipType: 'parent' | 'guardian'
            permissions: Record<string, boolean>
            isActive: boolean
            addedAt: Date
        }>
    }

    parentalControls?: {
        dailyTimeLimitMinutes: number
        weeklyTimeLimitMinutes: number
        bedtimeStart: string
        bedtimeEnd: string
        allowedDays: string[]
        contentFilters: Record<string, any>
        gameTimeLimitMinutes: number
        canPurchase: boolean
        spendingLimitCoins: number
        spendingLimitGems: number
        notificationsEnabled: boolean
        progressReportsEnabled: boolean
        reportFrequency: 'daily' | 'weekly' | 'monthly'
    }

    notifications: {
        email: boolean
        push: boolean
        assignments: boolean
        grades: boolean
        announcements: boolean
        progress: boolean
        achievements: boolean
        reminders: boolean
    }
}