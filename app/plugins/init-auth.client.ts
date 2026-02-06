export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const route = useRoute()

  if (!authStore.user) {
    await authStore.initAuth()
  }

  if (authStore.isAuthenticated && authStore.user && route.path === '/') {
    await navigateTo(authStore.dashboardRoute)
  }
})
