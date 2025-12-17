import { UserRole } from '..';

export interface AuthLoginRequest {
  email: string;
  pwd: string;
}

export interface AuthLoginResult {
  login: string,
  firstName: string,
  lastName: string,
  role: UserRole,
  accessToken: string
}