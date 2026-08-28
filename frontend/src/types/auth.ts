export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  organization: string;
  avatarInitials: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
