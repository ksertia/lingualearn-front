export default defineNuxtRouteMiddleware(async(to) => {

    const protections: Record<string, string | string[]> = {
        '/admin': 'admin',
        '/gestionnaire': 'plateform_manager',
        '/module-formateur': 'teacher',
        '/apprenant': ['learner', 'sub_account_learner']
    }

    
    const authStore = useAuthStore();
        if(authStore.token && !authStore.user) {
        await authStore.initAuth()
    }

    if(!authStore.user) {
        return
    }

    for (const [pathPrefix, requiredRole] of Object.entries(protections)) {
        if (to.path.startsWith(pathPrefix)) {
            const userType = authStore.user?.accountType
            const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
            if (!allowedRoles.includes(userType as string) && userType !== 'admin') {
                return navigateTo('/connexion')
            }
        }
    }
});