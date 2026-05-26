export default defineNuxtRouteMiddleware(async (to) =>{
  const authStore = useAuthStore()

  if (authStore.token && !authStore.user) {
    await authStore.initAuth()
  }

  const publicPaths = ['/', '/connexion']

  if (!authStore.isAuthenticated && !publicPaths.includes(to.path)) {
    return navigateTo('/connexion')
  }

  if (authStore.isAuthenticated && publicPaths.includes(to.path)) {
    const destination = authStore.dashboardRoute
    if (destination && !publicPaths.includes(destination)) {
      return navigateTo(destination)
    }
  }
})