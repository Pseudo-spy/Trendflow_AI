import type { LoginCredentials, UserSession } from '../types/auth';
import { supabase } from '../lib/supabase';

const mapUserSession = (user: any, token?: string): UserSession => {
  const email = user.email || '';
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0];
  
  return {
    id: user.id,
    email: email,
    name: fullName,
    role: user.user_metadata?.role || 'Pending Profile (Role)',
    organization: user.user_metadata?.organization || 'Pending Profile (Org)',
    avatarInitials: fullName.substring(0, 2).toUpperCase() || 'U',
    token: token,
  };
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<UserSession> => {
    if (!credentials.email || !credentials.password) {
      throw new Error('Please provide both email and password.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw error;
    }

    if (credentials.rememberMe) {
      localStorage.setItem('tf_remember_email', credentials.email);
    } else {
      localStorage.removeItem('tf_remember_email');
    }

    return mapUserSession(data.user, data.session?.access_token);
  },

  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    }
  },

  getCurrentUser: async (): Promise<UserSession | null> => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      return null;
    }
    return mapUserSession(data.session.user, data.session.access_token);
  },
};
