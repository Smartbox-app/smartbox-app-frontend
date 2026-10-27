import { UserRole } from 'src/smartbox-types';

export interface AuthLoginRequest {
  email: string;
  pwd: string;
}

export interface AuthLoginResult {
  login: string,
  firstName: string,
  lastName: string,
  role: UserRole,
}

export type SocialLoginRequest = {
  provider: 'google' | 'facebook' | 'facebook-jwt',
  token: string,
  tenant: string
}