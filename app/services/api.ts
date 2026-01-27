import type { LoginCredentials, AuthResponse, User } from '~/types/auth';
import type { parcours } from '~/types/parcours';
import type { DashboardResponse } from '~/types/dashboard';

class ApiService {
  private api;
  constructor() {
    const config = useRuntimeConfig();
    this.api = $fetch.create({
      baseURL: config.public.apiBase,
      onRequest({ options }) {
        const token = useCookie('token').value;
        if (token) {
          options.headers.set('Authorization', `Bearer ${token}`)
        }
      },

    })
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await this.api('v1/auth/login', {
      method: 'POST',
      body: credentials,
    });
  };

  async getMe(): Promise<{ data: User }> {
    return await this.api('v1/users/me');
  };

  async createParcours(Parcours: parcours): Promise<{ data: parcours }> {
    //Direction temporaire
    return await this.api('v1/parcours', {
      method: 'POST',
      body: Parcours,
    });
  }

  async getAdminDashboard(): Promise<DashboardResponse> {
    return await this.api('api/v1/admin/dashboard');
  }
}

let instance: ApiService;

export const useApiService = () => {
  if (!instance) {
    instance = new ApiService()
  }
  return instance
}
