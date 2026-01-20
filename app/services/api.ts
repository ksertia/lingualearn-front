import type { LoginCredentials, AuthResponse, User } from '~/types/auth';

class ApiService {
  private api;
  constructor() { 
    const config = useRuntimeConfig();
    this.api = $fetch.create({
      baseURL: config.public.apiBase,
      onRequest({options}){
        const token = useCookie('token').value;
        if(token){
          options.headers.set('Authorization', `Bearer ${token}`)
        }
      },
      
    })
  }

  async login(credentials:LoginCredentials): Promise<AuthResponse>{
    return await this.api('v1/auth/login', {
      method: 'POST',
      body: credentials,
    });
  };

  async getMe(): Promise<{ data: User }>{
    return await this.api('v1/users/me');
  }
}

let instance: ApiService;

export const useApiService = () => {
  if (!instance) {
    instance = new ApiService()
  }
  return instance
}
