import { AuthProvider } from "../enums/auth-provider.enum";

export interface AuthResponse {
  token: string;
  provider: AuthProvider;
}