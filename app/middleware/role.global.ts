export default defineNuxtRouteMiddleware((  to, from  ) => {
 
 const protections = {
    '/admin': 'admin',
    '/gestionnaire': 'plateform_manager',
    '/formateur': 'teacher'
 }   
  
    
 const authStore = useAuthStore();

  for (const [pathPrefix, requiredRole]
    of Object.entries(protections)) {
        if (to.path.startsWith(pathPrefix)) {
            if (authStore.user?.accountType !== requiredRole && authStore.user?.accountType !== 'admin') {
                return navigateTo ('/')
            }
        }
    }
});