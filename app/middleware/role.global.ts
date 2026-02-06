export default defineNuxtRouteMiddleware(async(  to, from  ) => {

    const protections = {
        '/admin': 'admin',
        '/gestionnaire': 'plateform_manager',
        '/formateur': 'teacher'
    }   

    
    const authStore = useAuthStore();
        if(authStore.token && !authStore.user) {
        await authStore.initAuth()
    }

    if(!authStore.user) {
        return
    }

    for (const [pathPrefix, requiredRole]
        of Object.entries(protections)) {
            if (to.path.startsWith(pathPrefix)) {
                if (authStore.user?.accountType !== requiredRole && authStore.user?.accountType !== 'admin') {
                    return navigateTo ('/')
                }
            }
        }
    });