import type { User as BaseUser} from '../../shared/models/user'

export type User = BaseUser

export interface LoginCredentials {
  loginInfo: string;
  password: string;
}


export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: User;
  };
}
