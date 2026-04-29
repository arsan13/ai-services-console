import { AuthProvider } from "../enums/auth-provider.enum";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  fullname: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userProfile?: UserProfile;
}

export interface UserProfile {
  id?: number;
  fullName?: string;
  username?: string;
  roles?: string[];
  permissions?: string[];
  providerType?: string | null;
}