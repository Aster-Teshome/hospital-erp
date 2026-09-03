import type { Role } from '../../utils/roles';

export interface SafeUser {
  id: string;
  hospitalId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}
