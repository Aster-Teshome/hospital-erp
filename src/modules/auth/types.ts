import type { Role } from '../../utils/roles';

export interface SafeUser {
  id: string;
  organizationId: string;
  hotelId: string | null;
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
