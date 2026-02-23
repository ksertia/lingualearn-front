import type { User as AppUser } from './user'

export type User = AppUser

export interface LoginCredentials {
  loginInfo: string;
  password: string;
}


export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    tokens: { accessToken: string, refreshToken: string };
    user: User;
  };
}
