import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApiService } from '~/services/api';
import type { LoginCredentials, User } from '~/types/auth';


export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const apiService = useApiService();
  const cookieBaseOptions = {
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/'
  }
  const token = useCookie<string | null>('token', cookieBaseOptions);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isAuthenticated = computed(() => !!token.value);
  const REMEMBER_DAYS = 30

  function setUser(newUser: User) {
    user.value = newUser;
  }

  function setToken(newToken: string, remember = false) {
    token.value = newToken

    if (remember) {
      const cookie = useCookie<string | null>('token', {
        ...cookieBaseOptions,
        maxAge: REMEMBER_DAYS * 24 * 60 * 60,
      })
      cookie.value = newToken
    }
  }

  function clearAuth() {
    const cookie = useCookie<string | null>('token', cookieBaseOptions)
    cookie.value = null
    user.value = null
    token.value = null
  }


  const userProfile = computed(() => {
    return user.value?.profile;
  })

  const fullname = computed(() => {
    if (!user.value?.profile) return 'invité';
    return `${user.value.profile.firstName} ${user.value.profile.lastName}`
  })

  const dashboardRoute = computed(() => {

    if (!user.value) {
      console.log(' user.value est null/undefined');
      return '/';
    }

    switch (user.value.accountType) {
      case 'admin':
        return '/admin/users';
      case 'plateform_manager':
        return '/gestionnaire';
      case 'teacher':
        return '/formateur';
      default:
        return '/';
    }
  })

  async function login(credentials: LoginCredentials, remember = false) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiService.login(credentials);
      if (response.success && response.data && dashboardRoute) {
        setToken(response.data.tokens.accessToken, remember);
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
    if (user.value) return

    const cookieToken = useCookie<string | null>('token', cookieBaseOptions).value
    if (!cookieToken) return

    if (!token.value) {
      token.value = cookieToken
    }

    try {
      const response = await apiService.getMe()
      setUser(response.data)
    } catch (err) {
      const e = err as FetchError
      const status = e.statusCode
      if (status === 401 || status === 403) {
        clearAuth()
      }
    }
  }

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
