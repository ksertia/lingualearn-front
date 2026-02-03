import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApiService } from '~/services/api';
import type { LoginCredentials, User } from '~/types/auth';
// import type { FetchError } from 'h3';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const apiService = useApiService();
  const token = useCookie<string | null>('token');
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isAuthenticated = computed(() => !!token.value);

  function setUser(newUser: User) {
    user.value = newUser;
  }

  function setToken(newToken: string) {
    token.value = newToken;
  }

  function clearAuth() {
    user.value = null;
    token.value = null;
  }

  const userProfile = computed(() => {
    return user.value?.profile;
  })

  const fullname = computed(() => {
    if (!user.value?.profile) return 'invité';
    return `${user.value.profile.firstName} ${user.value.profile.lastName}`
  })

  const dashboardRoute = computed(()=>{
  console.log(' DEBUG - user.value:', user.value);
  console.log('DEBUG - accountType:', user.value?.accountType);
  console.log(' DEBUG - typeof accountType:', typeof user.value?.accountType);
  
  if (!user.value) {
    console.log(' user.value est null/undefined');
    return '/';
  }
  
  switch (user.value.accountType) {
    case 'admin': 
      console.log(' Match: admin');
      return '/admin';
    case 'plateform_manager': 
      console.log(' Match: plateform_manager');
      return '/gestionnaire';
    case 'teacher': 
      console.log(' Match: teacher');
      return '/formateur';
    default: 
      console.log(' DEFAULT HIT - accountType reçu:', JSON.stringify(user.value.accountType));
      return '/';
  }
})

  async function login(credentials: LoginCredentials) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiService.login(credentials);
      if (response.success && response.data && dashboardRoute) {
        setToken(response.data.tokens.accessToken);
        setUser(response.data.user);
        return true;
      } else {
        error.value = response.message || 'Connexion echouée';
        return false;
      }
    } catch (err) {
      const e = err as FetchError;

      const status = e.statusCode;
      switch (status) {
        case 401:
          error.value = 'Email ou mot de passe incorrect';
          break;
        case 500:
          error.value = 'Erreur du serveur, réessayez plus tard';
          break;
        case 422:
          error.value = 'Certains champs du formulaire sont invalides';
          break;
        default:
          error.value = status ? 'Une erreur inconnue est survenue' : "La connexion est coupée ou impossible";
          break;
      }
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    clearAuth();
    navigateTo('/');
  }

  async function initAuth() {
    if (token.value && !user.value) {
      try {
        const response = await apiService.getMe();
        setUser(response.data);
      } catch (err) {
        clearAuth();
      }
    }
  }
  initAuth();

  return {
    user,
    initAuth,
    userProfile,
    fullname,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    dashboardRoute
  };
});
