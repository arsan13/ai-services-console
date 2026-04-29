export interface Environment {
  production: boolean;
  apiUrl: string;

  // optional extras
  appName?: string;
  version?: string;
}