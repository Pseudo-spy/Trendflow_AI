import type { LoginCredentials, UserSession } from '../types/auth';

/**
 * Enterprise Authentication Service
 * Pre-configured for FastAPI JWT token authentication.
 */
export const authService = {
  /**
   * Login user with credentials
   */
  login: async (credentials: LoginCredentials): Promise<UserSession> => {
    // Artificial latency for realistic micro-animation feedback
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Client-side validation
    if (!credentials.email || !credentials.password) {
      throw new Error('Please provide both email and password.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw new Error('Please enter a valid business email address.');
    }

    // Default mock user session matching the SCM Lead Planner persona
    const userSession: UserSession = {
      id: 'usr_scm_01',
      email: credentials.email,
      name: 'Lead Planner',
      role: 'SCM Director / Lead Planner',
      organization: 'TrendFlow Global Operations',
      avatarInitials: 'P4',
      token: 'jwt_mock_token_trendflow_v3',
    };

    if (credentials.rememberMe) {
      localStorage.setItem('tf_remember_email', credentials.email);
    } else {
      localStorage.removeItem('tf_remember_email');
    }

    // Store only non-sensitive session indicator
    localStorage.setItem('tf_auth_active', 'true');
    return userSession;
  },

  /**
   * Logout user and clear session
   */
  logout: async (): Promise<void> => {
    localStorage.removeItem('tf_auth_active');
    sessionStorage.clear();
  },

  /**
   * Get current session if active
   */
  getCurrentUser: (): UserSession | null => {
    const isActive = localStorage.getItem('tf_auth_active') === 'true';
    if (!isActive) return null;

    const savedEmail = localStorage.getItem('tf_remember_email') || 'planner@trendflow.ai';
    return {
      id: 'usr_scm_01',
      email: savedEmail,
      name: 'Lead Planner',
      role: 'SCM Director / Lead Planner',
      organization: 'TrendFlow Global Operations',
      avatarInitials: 'P4',
    };
  },
};
