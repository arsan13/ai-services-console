import { AuthProvider } from "../enums/auth-provider.enum";
import { RoleType } from "../enums/role-type.enum";
import { Permission } from "./permission.model";

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
  roles?: RoleType[];
  permissions?: Permission[];
  providerType?: AuthProvider;
}