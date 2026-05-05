import { AuthProvider } from "../enums/auth-provider.enum";
import { RoleType } from "../enums/role-type.enum";
import { Permission } from "./permission.model";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullname: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  userProfile?: UserProfile;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  username?: string;
  roles: RoleType[];
  permissions: Permission[];
  providerType: AuthProvider;
  verified: boolean;
  passwordResetDate: Date | null;
}