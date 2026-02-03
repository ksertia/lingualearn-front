export default defineNuxtRouteMiddleware(async (to, from) =>{
  const authStore = useAuthStore()

  if (authStore.token && !authStore.user) {
    await authStore.initAuth()
  }

  if (!authStore.isAuthenticated && to.path !== '/') {
    return navigateTo('/')
  }

  if(authStore.isAuthenticated && to.path === '/') {
    const destination = authStore.dashboardRoute
    
    if (destination !== '/') {
      return navigateTo(destination)
    }
  }
})