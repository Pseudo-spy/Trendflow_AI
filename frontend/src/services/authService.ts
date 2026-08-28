import type { LoginCredentials, UserSession } from '../types/auth';

const mapMockUserSession = (email: string): UserSession => {
  const fullName = email.split('@')[0];
  
  return {
    id: 'mock-user-id',
    email: email,
    name: fullName,
    role: 'Supply Chain Planner',
    organization: 'TrendFlow Inc',
    avatarInitials: fullName.substring(0, 2).toUpperCase() || 'U',
    token: 'mock-token',
  };
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<UserSession> => {
    if (!credentials.email || !credentials.password) {
      throw new Error('Please provide both email and password.');
    }

    // Temporary Frontend Authentication
    // Bypassing real validation for development showcase flow
    sessionStorage.setItem('temporaryAuthenticated', 'true');
    sessionStorage.setItem('temporaryEmail', credentials.email);

    if (credentials.rememberMe) {
      localStorage.setItem('tf_remember_email', credentials.email);
    } else {
      localStorage.removeItem('tf_remember_email');
    }

    return mapMockUserSession(credentials.email);
  },

  logout: async (): Promise<void> => {
    // Temporary Frontend Authentication
    sessionStorage.removeItem('temporaryAuthenticated');
    sessionStorage.removeItem('temporaryEmail');
  },

  getCurrentUser: async (): Promise<UserSession | null> => {
    // Temporary Frontend Authentication
    const isAuth = sessionStorage.getItem('temporaryAuthenticated') === 'true';
    if (!isAuth) {
      return null;
    }
    const email = sessionStorage.getItem('temporaryEmail') || 'planner@trendflow.ai';
    return mapMockUserSession(email);
  },
};
